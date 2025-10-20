# Lumiere AI Layer - Architecture

## Objective
The AI Layer handles:
1. SQL generation from user queries (via LLM)
2. Chart configuration generation (via data analysis)
3. Insight summarization using embeddings + retrieval

---

## Workflow Overview
User Question → LLM → SQL Query → Execute on DB → Return Data  
↓  
LLM + Prompt Template → Chart Config (Chart.js format)  
↓  
LLM → Generate Summary Insight Text

---

## Prompt Templates
- `sql_generation_prompt.txt`
- `chart_generation_prompt.txt`
- `insight_prompt.txt`

All prompts stored under `/ai_layer/prompt_templates/`

---

## Example Output
### Input:
> "Top 5 customers by revenue last quarter"

### Output:
```json
{
  "sql": "SELECT customer_name, SUM(revenue) AS total_revenue FROM sales WHERE quarter = 'Q3' GROUP BY customer_name ORDER BY total_revenue DESC LIMIT 5;",
  "chart_config": {
    "type": "bar",
    "x": ["Customer A", "Customer B", "Customer C", "Customer D", "Customer E"],
    "y": [10500, 9800, 9200, 8800, 8500]
  },
  "insight": "Customer A leads with highest revenue in Q3, showing strong retention in premium segment."
}
```
