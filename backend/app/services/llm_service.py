"""
LLM Service - Integration with OpenAI for AI-powered features.
Handles SQL generation, chart configuration, and insight generation.
"""

import json
from typing import Optional, Dict, Any, List
from openai import OpenAI
from app.core.config import settings


class LLMService:
    """Service for interacting with OpenAI LLM"""
    
    def __init__(self):
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
        self.model = "gpt-4o-mini"  # Using GPT-4 Turbo for better SQL generation
        self.temperature = 0.1  # Low temperature for more deterministic outputs
    
    def generate_sql(
        self,
        question: str,
        table_schema: Dict[str, Any],
        sample_data: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Generate SQL query from natural language question.
        
        Args:
            question: User's natural language question
            table_schema: Schema information (columns, types)
            sample_data: Sample rows from the data
        
        Returns:
            Dict with 'sql', 'explanation', and 'confidence'
        """
        # Build prompt
        prompt = self._build_sql_prompt(question, table_schema, sample_data)
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert SQL query generator. Generate SQL queries for pandas DataFrames using standard SQL syntax. Always return valid JSON."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=self.temperature,
                response_format={"type": "json_object"}
            )
            
            # Parse response
            result = json.loads(response.choices[0].message.content)
            
            return {
                "sql": result.get("sql", ""),
                "explanation": result.get("explanation", ""),
                "confidence": result.get("confidence", 0.8)
            }
            
        except Exception as e:
            raise Exception(f"LLM error: {str(e)}")
    
    def _build_sql_prompt(
        self,
        question: str,
        table_schema: Dict[str, Any],
        sample_data: List[Dict[str, Any]]
    ) -> str:
        """Build the SQL generation prompt"""
        
        columns = table_schema.get("columns", [])
        column_list = ", ".join(columns)
        
        # Format sample data
        sample_rows = "\n".join([
            ", ".join([f"{k}={v}" for k, v in row.items()])
            for row in sample_data[:3]  # Only show 3 sample rows
        ])
        
        prompt = f"""
Given a dataset with the following schema:

TABLE: data
COLUMNS: {column_list}

SAMPLE DATA (first 3 rows):
{sample_rows}

USER QUESTION: "{question}"

Generate a SQL query to answer this question. The query will be executed on a pandas DataFrame using pandasql, so use standard SQL syntax.

IMPORTANT RULES:
1. Use "data" as the table name
2. Column names must exactly match the schema (case-sensitive)
3. Use standard SQL syntax (SELECT, FROM, WHERE, GROUP BY, ORDER BY, LIMIT, etc.)
4. Do NOT use CTEs or window functions (not supported in pandasql)
5. For aggregations, always use GROUP BY
6. For filtering, use WHERE clause
7. Keep queries simple and efficient

Return your response in JSON format:
{{
  "sql": "SELECT ... FROM data ...",
  "explanation": "Brief explanation of what the query does",
  "confidence": 0.9
}}

The confidence should be between 0.0 and 1.0 based on how certain you are that the query correctly answers the question.
"""
        return prompt
    
    def generate_chart_config(
        self,
        question: str,
        sql: str,
        query_results: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Generate chart configuration from query results.
        
        Args:
            question: Original user question
            sql: The SQL query that was executed
            query_results: Results from query execution
        
        Returns:
            Dict with Chart.js compatible configuration
        """
        prompt = self._build_chart_prompt(question, sql, query_results)
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert at data visualization. Generate Chart.js configurations that best represent the data."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=self.temperature,
                response_format={"type": "json_object"}
            )
            
            result = json.loads(response.choices[0].message.content)
            return result
            
        except Exception as e:
            raise Exception(f"Chart generation error: {str(e)}")
    
    def _build_chart_prompt(
        self,
        question: str,
        sql: str,
        query_results: Dict[str, Any]
    ) -> str:
        """Build the chart generation prompt"""
        
        columns = query_results.get("columns", [])
        rows = query_results.get("rows", [])[:10]  # Only show first 10 rows
        
        prompt = f"""
QUESTION: "{question}"
SQL QUERY: {sql}

RESULTS:
Columns: {columns}
Row count: {query_results.get('row_count', 0)}
Sample data (first 10 rows):
{json.dumps(rows, indent=2)}

Based on the question and results, suggest the best chart type and generate a Chart.js compatible configuration.

Choose from: bar, line, pie, doughnut, scatter, area

Return JSON:
{{
  "type": "bar|line|pie|doughnut|scatter|area",
  "title": "Chart title",
  "labels": ["Label 1", "Label 2", ...],
  "datasets": [
    {{
      "label": "Dataset name",
      "data": [value1, value2, ...]
    }}
  ],
  "explanation": "Why this chart type was chosen"
}}
"""
        return prompt
    
    def generate_insight(
        self,
        question: str,
        sql: str,
        query_results: Dict[str, Any]
    ) -> str:
        """
        Generate textual insights from query results.
        
        Args:
            question: Original user question
            sql: The SQL query that was executed
            query_results: Results from query execution
        
        Returns:
            Insight text
        """
        prompt = self._build_insight_prompt(question, sql, query_results)
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a data analyst. Provide clear, actionable insights from data analysis results."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.3  # Slightly higher for more creative insights
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            raise Exception(f"Insight generation error: {str(e)}")
    
    def _build_insight_prompt(
        self,
        question: str,
        sql: str,
        query_results: Dict[str, Any]
    ) -> str:
        """Build the insight generation prompt"""
        
        rows = query_results.get("rows", [])[:20]  # Show more rows for insights
        
        prompt = f"""
USER QUESTION: "{question}"
SQL QUERY: {sql}

ANALYSIS RESULTS:
Total rows: {query_results.get('row_count', 0)}
Data:
{json.dumps(rows, indent=2)}

Analyze these results and provide 2-3 key insights that answer the user's question.

Focus on:
1. Direct answer to the question
2. Notable patterns or trends
3. Actionable recommendations

Keep the insights concise (3-5 sentences total) and business-focused.
"""
        return prompt

