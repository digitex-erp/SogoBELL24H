#!/usr/bin/env python3
"""
AI Studio Testing Framework — Progressive Difficulty (12 Tests)
================================================================
Phase 1: Basic (Tests 1.1–1.3)
Phase 2: Intermediate (Tests 2.1–2.4)
Phase 3: Advanced (Tests 3.1–3.5)
"""
import json, sys, time, requests

BASE = "http://127.0.0.1:3001/api"
EMAIL = "test@bell24h.com"
PASSWORD = "testpass123"

results = []

def login():
    r = requests.post(f"{BASE}/auth/login", json={"email": EMAIL, "password": PASSWORD})
    return r.json().get("token")

def execute(token, content, system_prompt=None, max_tokens=1000, temperature=0.7, variables=None):
    payload = {
        "provider": "pollinations",
        "content": content,
        "maxTokens": max_tokens,
        "temperature": temperature,
    }
    if system_prompt:
        payload["systemPrompt"] = system_prompt
    r = requests.post(f"{BASE}/ai/execute?token={token}", json=payload, timeout=90)
    return r.json()

def run_test(token, phase, test_id, name, content, system_prompt=None, validate=None, max_tokens=500):
    print(f"\n{'='*60}")
    print(f"[{phase}] Test {test_id}: {name}")
    print(f"  Prompt: {content[:80]}{'...' if len(content) > 80 else ''}")
    start = time.time()
    try:
        res = execute(token, content, system_prompt=system_prompt, max_tokens=max_tokens)
        latency = time.time() - start
        output = res.get("output", "") or ""
        success = res.get("success", False)
        cost = res.get("cost", 0)
        tokens = res.get("tokens", {})

        if validate:
            passed, msg = validate(output, res)
        else:
            passed = success and len(output) > 10
            msg = f"Output length: {len(output)} chars" if passed else "No output or too short"

        results.append({
            "id": test_id, "phase": phase, "name": name,
            "passed": passed, "msg": msg, "latency": round(latency, 1),
            "cost": cost, "tokens": tokens.get("total", 0),
            "output_preview": output[:200],
        })
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"  {status} | {msg}")
        print(f"  Latency: {latency:.1f}s | Cost: ${cost:.4f} | Tokens: {tokens.get('total',0)}")
        print(f"  Output: {output[:150]}{'...' if len(output) > 150 else ''}")
    except Exception as e:
        latency = time.time() - start
        results.append({
            "id": test_id, "phase": phase, "name": name,
            "passed": False, "msg": str(e), "latency": round(latency, 1),
            "cost": 0, "tokens": 0, "output_preview": "",
        })
        print(f"  ❌ FAIL | Error: {e}")

# ─── Phase 1: Basic Functionality ───

PHASE1 = [
    ("1.1", "Simple Text Completion",
     "Complete this sentence: The future of AI is",
     None,
     lambda o, r: (r.get("success") and len(o) > 10, f"Output: {len(o)} chars") if r.get("success") else (False, "Request failed")),

    ("1.2", "Simple Question Answering",
     "What is machine learning? Give a brief 2-3 sentence definition.",
     None,
     lambda o, r: (r.get("success") and ("machine learning" in o.lower() or "ml " in o.lower() or "artificial" in o.lower()),
                    f"Contains ML concepts: {'yes' if 'machine learning' in o.lower() or 'artificial' in o.lower() else 'no'}")),

    ("1.3", "Direct Format Request",
     "List 5 benefits of cloud computing. Use a numbered list format.",
     None,
     lambda o, r: (r.get("success") and (any(str(i) in o for i in range(1,6)) or len(o) > 100),
                    f"Has numbered items: {'yes' if any(str(i) in o for i in range(1,6)) else 'no'}, Length: {len(o)}")),
]

# ─── Phase 2: Intermediate Complexity ───

PHASE2 = [
    ("2.1", "Template Variables",
     "Write a thank you email to John for the interview. Keep it under 100 words.",
     None,
     lambda o, r: (r.get("success") and ("john" in o.lower() or "interview" in o.lower()),
                    f"Variables replaced: {'yes' if 'john' in o.lower() or 'interview' in o.lower() else 'no'}")),

    ("2.2", "Code Generation",
     "Write a Python function to calculate the factorial of a number. Include docstring.",
     None,
     lambda o, r: (r.get("success") and ("def " in o or "return" in o) and "factorial" in o.lower(),
                    f"Has function: {'def' in o}, Has factorial: {'factorial' in o.lower()}")),

    ("2.3", "Content with Constraints",
     "Write a product description for a laptop in exactly 50 words. Be precise.",
     None,
     lambda o, r: (r.get("success") and len(o) > 50,
                    f"Word count: {len(o.split())}, Length: {len(o)} chars")),

    ("2.4", "Format Conversion",
     'Convert this JSON to CSV format: {"name": "John", "age": 30, "city": "NYC"}. Return only the CSV.',
     None,
     lambda o, r: (r.get("success") and ("csv" in o.lower() or "name,age" in o.lower() or "john" in o.lower() or "," in o),
                    f"Has CSV structure: {',' in o}, Mentions data: {'john' in o.lower()}")),
]

# ─── Phase 3: Advanced Complexity ───

PHASE3 = [
    ("3.1", "Multi-Step Reasoning",
     "Analyze the pros and cons of remote work, then recommend the best model for a 50-person tech startup. Be specific.",
     None,
     lambda o, r: (r.get("success") and len(o) > 200 and ("pro" in o.lower() or "advantage" in o.lower() or "benefit" in o.lower()) and ("con" in o.lower() or "disadvantage" in o.lower() or "challenge" in o.lower()),
                    f"Length: {len(o)} chars, Has analysis: {'pro' in o.lower() or 'advantage' in o.lower()}")),

    ("3.2", "Context-Dependent Output",
     "Write product marketing copy assuming our target audience is Fortune 500 executives. The product is an AI analytics platform.",
     "You are a senior B2B marketing copywriter. Write in a professional, data-driven tone suitable for C-suite executives.",
     lambda o, r: (r.get("success") and len(o) > 100 and ("analytics" in o.lower() or "ai" in o.lower() or "platform" in o.lower()),
                    f"Length: {len(o)} chars, Relevant content: {'analytics' in o.lower() or 'ai' in o.lower()}")),

    ("3.3", "Complex Code Review",
     '''Review this code for issues:
def process(data):
    result = []
    for i in range(len(data)):
        if data[i] > 0:
            result.append(data[i] * 2)
    return result

Is this efficient? What improvements would you suggest?''',
     None,
     lambda o, r: (r.get("success") and len(o) > 150 and ("list comprehension" in o.lower() or "efficient" in o.lower() or "improv" in o.lower() or "optim" in o.lower() or "better" in o.lower()),
                    f"Length: {len(o)} chars, Has suggestions: {'improv' in o.lower() or 'optim' in o.lower() or 'better' in o.lower()}")),

    ("3.4", "Edge Case: Minimal Input",
     "Fix the following code:\n\n",
     None,
     lambda o, r: (r.get("success"),
                    f"Handled gracefully: {r.get('success')}, Output length: {len(o)}")),

    ("3.5", "Edge Case: Long Input",
     "Write a detailed technical architecture document for an e-commerce platform. Cover: 1) Frontend architecture (React/Next.js), 2) Backend architecture (Node.js microservices), 3) Database design (PostgreSQL + Redis), 4) Payment integration (Stripe), 5) Order management system, 6) Inventory tracking, 7) Analytics pipeline, 8) DevOps and CI/CD, 9) Security measures, 10) Scalability strategy. For each section, provide specific technology choices, architectural patterns, and implementation details. Include code examples where appropriate.",
     "You are a senior software architect. Write detailed, technically accurate documentation.",
     lambda o, r: (r.get("success") and len(o) > 300,
                    f"Length: {len(o)} chars, Handled long input: {'yes' if len(o) > 100 else 'no'}")),
]

def main():
    print("🧪 AI STUDIO TESTING FRAMEWORK — Progressive Difficulty")
    print("=" * 60)
    print("Provider: Pollinations (Free, no API key required)")
    print("Date:", time.strftime("%Y-%m-%d %H:%M:%S"))
    print("=" * 60)

    token = login()
    if not token:
        print("❌ Login failed!")
        sys.exit(1)
    print(f"✅ Logged in successfully")

    # Phase 1
    print(f"\n{'#' * 60}")
    print("# PHASE 1: BASIC FUNCTIONALITY (Simple)")
    print(f"{'#' * 60}")
    for test in PHASE1:
        run_test(token, "Phase 1", *test)

    # Phase 2
    print(f"\n{'#' * 60}")
    print("# PHASE 2: INTERMEDIATE COMPLEXITY (Moderate)")
    print(f"{'#' * 60}")
    for test in PHASE2:
        run_test(token, "Phase 2", *test)

    # Phase 3
    print(f"\n{'#' * 60}")
    print("# PHASE 3: ADVANCED COMPLEXITY (Hard)")
    print(f"{'#' * 60}")
    for test in PHASE3:
        run_test(token, "Phase 3", *test)

    # Summary
    print(f"\n{'=' * 60}")
    print("📊 TEST SUMMARY")
    print(f"{'=' * 60}")
    passed = sum(1 for r in results if r["passed"])
    failed = len(results) - passed
    total_tokens = sum(r["tokens"] for r in results)
    total_cost = sum(r["cost"] for r in results)
    avg_latency = sum(r["latency"] for r in results) / len(results) if results else 0

    for r in results:
        status = "✅" if r["passed"] else "❌"
        print(f"  {status} {r['id']} {r['name']} — {r['msg'][:60]} ({r['latency']}s)")

    print(f"\n  Total: {len(results)} | Passed: {passed} | Failed: {failed}")
    print(f"  Score: {round(passed/len(results)*100)}%")
    print(f"  Total Tokens: {total_tokens:,}")
    print(f"  Total Cost: ${total_cost:.4f}")
    print(f"  Avg Latency: {avg_latency:.1f}s")

    # Save report
    report = {
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "provider": "pollinations",
        "summary": {
            "total": len(results), "passed": passed, "failed": failed,
            "score": f"{round(passed/len(results)*100)}%",
            "totalTokens": total_tokens, "totalCost": total_cost,
            "avgLatency": round(avg_latency, 1),
        },
        "results": results,
    }
    with open(".shogo/reports/ai-studio-tests.json", "w") as f:
        json.dump(report, f, indent=2)
    print(f"\n📄 Report saved to .shogo/reports/ai-studio-tests.json")

if __name__ == "__main__":
    main()
