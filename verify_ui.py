import os
import time
from playwright.sync_api import sync_playwright

SCREENSHOT_DIR = r"C:\Users\lenovo\.gemini\antigravity-ide\brain\e0316ee5-250e-4931-8f29-2d30029574b0"
os.makedirs(SCREENSHOT_DIR, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1366, "height": 850})
    
    print("Navigating to http://127.0.0.1:5173/ ...")
    page.goto("http://127.0.0.1:5173/", wait_until="networkidle")
    time.sleep(1)

    # 1. Screen 2 - Officer Console (Case A: Fast Lane with Real Stamped Caste Certificate)
    print("Capturing Screen 2 - Case A (Fast Lane with Real Scanned Certificate)...")
    page.screenshot(path=os.path.join(SCREENSHOT_DIR, "screen2_caseA_real_caste_cert.png"), full_page=False)

    # Toggle to Income Certificate on Case A
    print("Testing Case A Income Certificate view...")
    page.locator("button:has-text('Income Certificate')").first.click()
    time.sleep(1)
    page.screenshot(path=os.path.join(SCREENSHOT_DIR, "screen2_caseA_real_income_cert.png"), full_page=False)

    # 2. Case B - Minor Deficiency (Sunita Munda: Expired Income Cert & Name Typo)
    print("Testing Case B (Standard Lane)...")
    case_b_btn = page.locator("button:has-text('Sunita Munda')")
    case_b_btn.click()
    time.sleep(1)
    page.screenshot(path=os.path.join(SCREENSHOT_DIR, "screen2_caseB_real_expired_income.png"), full_page=False)

    # Switch back to Caste Cert to see typo flag
    page.locator("button:has-text('Caste Certificate')").first.click()
    time.sleep(0.5)
    page.screenshot(path=os.path.join(SCREENSHOT_DIR, "screen2_caseB_real_caste_typo.png"), full_page=False)

    # Scroll down to capture Consolidated Deficiency Packet and Web Speech audio
    page.evaluate("window.scrollTo(0, 500)")
    time.sleep(0.5)
    page.screenshot(path=os.path.join(SCREENSHOT_DIR, "screen2_caseB_scrolled_deficiency.png"), full_page=False)
    page.evaluate("window.scrollTo(0, 0)")

    # 3. Case C - Shared Bank Account Cluster
    print("Testing Case C (Review Lane - Shared Bank Cluster)...")
    case_c_btn = page.locator("button:has-text('Amit Kumar Tirkey')")
    case_c_btn.click()
    time.sleep(1)
    page.screenshot(path=os.path.join(SCREENSHOT_DIR, "screen2_caseC_review_cluster.png"), full_page=False)

    # Scroll down to capture Bank Cluster Topology, 3 Hypotheses, and Officer Actions
    page.evaluate("window.scrollTo(0, 480)")
    time.sleep(0.5)
    page.screenshot(path=os.path.join(SCREENSHOT_DIR, "screen2_caseC_scrolled_cluster.png"), full_page=False)
    page.evaluate("window.scrollTo(0, 0)")

    # Test Officer Action on Case C and Audit Log
    print("Testing Officer Action on Case C and Audit Log...")
    req_btn = page.locator("button:has-text('Request Explanation')")
    req_btn.click()
    time.sleep(0.5)

    audit_btn = page.locator("button:has-text('Audit Log')")
    audit_btn.click()
    time.sleep(0.5)
    page.screenshot(path=os.path.join(SCREENSHOT_DIR, "screen2_audit_log_modal.png"), full_page=False)
    
    # Click the modal Close button
    close_btn = page.locator("button:has-text('Close')")
    close_btn.click()
    time.sleep(0.5)

    # Test Real Open Government Data (OGD) Explorer Modal
    print("Testing Real Open Government Data (OGD) Modal...")
    ogd_btn = page.locator("button:has-text('Open Gov Data')")
    ogd_btn.click()
    time.sleep(1)
    page.screenshot(path=os.path.join(SCREENSHOT_DIR, "ogd_modal_tribes.png"), full_page=False)

    print("Testing Live IFSC API tab in OGD...")
    ifsc_tab = page.locator("button:has-text('Live Open IFSC API Query')")
    ifsc_tab.click()
    time.sleep(1)
    page.screenshot(path=os.path.join(SCREENSHOT_DIR, "ogd_modal_live_ifsc.png"), full_page=False)

    page.locator("button:has-text('Close')").click()
    time.sleep(0.5)

    # 4. Switch to Screen 1 - Student Intake & Real Canvas Quality Check
    print("Navigating to Screen 1 (Student Intake)...")
    tab1 = page.locator("button:has-text('1. Student Intake')")
    tab1.click()
    time.sleep(1)

    print("Testing Real Dumka ST Certificate scan load...")
    dumka_scan_btn = page.locator("button:has-text('Load Dumka ST Scan')")
    dumka_scan_btn.click()
    time.sleep(1.5)
    page.screenshot(path=os.path.join(SCREENSHOT_DIR, "screen1_real_dumka_scan_check.png"), full_page=False)

    print("Testing Blurry Photo check...")
    blurry_btn = page.locator("button:has-text('Test Blurry Photo')").first
    blurry_btn.click()
    time.sleep(1.5)
    page.screenshot(path=os.path.join(SCREENSHOT_DIR, "screen1_canvas_blurry_check.png"), full_page=False)

    # 5. Switch to Screen 3 - Desk SLA & Student Tracker
    print("Navigating to Screen 3 (Desk SLA & Student Tracker)...")
    tab3 = page.locator("button:has-text('3. Desk SLA')")
    tab3.click()
    time.sleep(1)
    page.screenshot(path=os.path.join(SCREENSHOT_DIR, "screen3_sla_tracker.png"), full_page=False)

    print("Testing Simulated Fast-Forward SLA Escalation...")
    sla_btn = page.locator("button:has-text('+5 Days (Overdue Test)')")
    sla_btn.click()
    time.sleep(1)
    page.screenshot(path=os.path.join(SCREENSHOT_DIR, "screen3_sla_escalated_red.png"), full_page=False)

    browser.close()
    print("Playwright UI verification completed successfully! All screenshots saved.")
