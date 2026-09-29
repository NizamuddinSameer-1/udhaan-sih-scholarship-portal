import os
import math
from PIL import Image, ImageDraw, ImageFont

OUTPUT_DIR = r"c:\Users\lenovo\OneDrive\Desktop\Scholarship Problem\public\certificates"
os.makedirs(OUTPUT_DIR, exist_ok=True)

WIDTH = 1240
HEIGHT = 1754 # Standard A4 at 150 DPI

def get_font(size, bold=False):
    # Try Indian Devanagari system font first (Nirmala UI / Nirmala.ttc)
    devanagari_paths = [
        r"C:\Windows\Fonts\Nirmala.ttc",
        r"C:\Windows\Fonts\NirmalaB.ttf" if bold else r"C:\Windows\Fonts\Nirmala.ttf",
        "Nirmala.ttc",
        "arialbd.ttf" if bold else "arial.ttf",
        "segoeuib.ttf" if bold else "segoeui.ttf",
        "calibrib.ttf" if bold else "calibri.ttf"
    ]
    
    for fn in devanagari_paths:
        try:
            return ImageFont.truetype(fn, size)
        except:
            continue
    return ImageFont.load_default()

def draw_circular_stamp(draw, center_x, center_y, radius, title_text, sub_text, color=(35, 45, 115, 210)):
    # Draw double circle rubber stamp
    draw.ellipse([center_x - radius, center_y - radius, center_x + radius, center_y + radius], outline=color, width=4)
    draw.ellipse([center_x - radius + 8, center_y - radius + 8, center_x + radius - 8, center_y + radius - 8], outline=color, width=2)
    
    font_stamp = get_font(20, bold=True)
    font_sub = get_font(16, bold=True)
    
    # Text in center
    draw.text((center_x, center_y - 25), title_text, fill=color, font=font_stamp, anchor="mm")
    draw.text((center_x, center_y + 2), "★ GOVERNMENT OF JHARKHAND ★", fill=color, font=font_sub, anchor="mm")
    draw.text((center_x, center_y + 28), sub_text, fill=color, font=font_stamp, anchor="mm")

def draw_digital_signature_box(draw, x, y, w, h, officer_name, officer_title, date_str, hash_str):
    # Digital signature green border box
    draw.rectangle([x, y, x + w, y + h], outline=(15, 125, 60), width=2, fill=(245, 252, 247))
    
    # Green checkmark circle
    draw.ellipse([x + 12, y + 14, x + 44, y + 46], fill=(16, 130, 65))
    draw.line([x + 20, y + 30, x + 26, y + 38], fill=(255, 255, 255), width=3)
    draw.line([x + 26, y + 38, x + 38, y + 22], fill=(255, 255, 255), width=3)
    
    font_bold = get_font(18, bold=True)
    font_sm = get_font(13)
    font_xs = get_font(11)
    
    draw.text((x + 54, y + 16), "Signature Valid", fill=(16, 130, 65), font=font_bold)
    draw.text((x + 54, y + 38), f"Digitally Signed by: {officer_name}", fill=(20, 30, 45), font=get_font(15, bold=True))
    draw.text((x + 54, y + 58), f"Designation: {officer_title}", fill=(50, 60, 75), font=font_sm)
    draw.text((x + 54, y + 76), f"Signing Date: {date_str}", fill=(50, 60, 75), font=font_sm)
    draw.text((x + 54, y + 94), f"SHA-256: {hash_str[:28]}...", fill=(100, 110, 125), font=font_xs)

def draw_qr_code_mock(draw, x, y, size):
    # Authentic QR code representation
    draw.rectangle([x, y, x + size, y + size], fill=(255, 255, 255), outline=(30, 30, 30), width=2)
    # Finder patterns in 3 corners
    for corner_x, corner_y in [(x + 8, y + 8), (x + size - 36, y + 8), (x + 8, y + size - 36)]:
        draw.rectangle([corner_x, corner_y, corner_x + 28, corner_y + 28], fill=(0, 0, 0))
        draw.rectangle([corner_x + 6, corner_y + 6, corner_x + 22, corner_y + 22], fill=(255, 255, 255))
        draw.rectangle([corner_x + 10, corner_y + 10, corner_x + 18, corner_y + 18], fill=(0, 0, 0))
    
    # Internal random pixel pattern
    import random
    rng = random.Random(42)
    for px in range(x + 12, x + size - 12, 8):
        for py in range(y + 12, y + size - 12, 8):
            if not ((px < x + 44 and py < y + 44) or (px > x + size - 44 and py < y + 44) or (px < x + 44 and py > y + size - 44)):
                if rng.random() > 0.5:
                    draw.rectangle([px, py, px + 6, py + 6], fill=(0, 0, 0))

def draw_barcode(draw, x, y, w, h, text):
    draw.rectangle([x, y, x + w, y + h], fill=(255, 255, 255))
    import random
    rng = random.Random(hash(text))
    cur_x = x + 10
    while cur_x < x + w - 10:
        bar_w = rng.choice([2, 3, 5, 6])
        if rng.random() > 0.3:
            draw.rectangle([cur_x, y + 5, cur_x + bar_w, y + h - 18], fill=(0, 0, 0))
        cur_x += bar_w + rng.choice([2, 4])
    
    font_code = get_font(13, bold=True)
    draw.text((x + w // 2, y + h - 10), text, fill=(0, 0, 0), font=font_code, anchor="mm")

def create_certificate(filename, doc_type, data):
    img = Image.new("RGB", (WIDTH, HEIGHT), color=(253, 252, 248))
    draw = ImageDraw.Draw(img)
    
    # 1. Government Security Guilloche Double Border
    draw.rectangle([30, 30, WIDTH - 30, HEIGHT - 30], outline=(15, 35, 75), width=6)
    draw.rectangle([42, 42, WIDTH - 42, HEIGHT - 42], outline=(180, 115, 25), width=2)
    draw.rectangle([48, 48, WIDTH - 48, HEIGHT - 48], outline=(15, 35, 75), width=1)
    
    # Corner flourishes
    for cx, cy in [(30, 30), (WIDTH - 30, 30), (30, HEIGHT - 30), (WIDTH - 30, HEIGHT - 30)]:
        draw.arc([cx - 20, cy - 20, cx + 20, cy + 20], 0, 360, fill=(180, 115, 25), width=3)
    
    # 2. Watermark in Center
    font_wm = get_font(52, bold=True)
    draw.text((WIDTH // 2, HEIGHT // 2 - 40), "GOVERNMENT OF JHARKHAND", fill=(238, 235, 226), font=font_wm, anchor="mm")
    draw.text((WIDTH // 2, HEIGHT // 2 + 30), "REVENUE DEPARTMENT • OFFICIAL VERIFIED", fill=(240, 238, 230), font=get_font(34, bold=True), anchor="mm")
    
    # 3. Top Header Barcode & Form Number
    draw_barcode(draw, WIDTH - 380, 65, 320, 65, data["cert_no"])
    
    font_form = get_font(15, bold=True)
    form_text = "प्रपत्र-IV (नियम 3(1) देखिए) / FORM-IV" if doc_type == "CASTE" else "प्रपत्र-XVI (नियम 5 देखिए) / FORM-XVI"
    draw.text((70, 75), form_text, fill=(80, 80, 80), font=font_form)
    draw.text((70, 98), "JharSewa Portal (e-District Mission Mode Project)", fill=(100, 100, 100), font=get_font(13))
    
    # 4. Header Titles
    draw.text((WIDTH // 2, 170), "झारखण्ड सरकार / GOVERNMENT OF JHARKHAND", fill=(15, 35, 75), font=get_font(26, bold=True), anchor="mm")
    draw.text((WIDTH // 2, 205), "राजस्व, निबंधन एवं भूमि सुधार विभाग", fill=(15, 35, 75), font=get_font(20, bold=True), anchor="mm")
    draw.text((WIDTH // 2, 232), "DEPARTMENT OF REVENUE, REGISTRATION & LAND REFORMS", fill=(60, 70, 85), font=get_font(16, bold=True), anchor="mm")
    draw.text((WIDTH // 2, 260), f"कार्यालय: {data['office_name']}", fill=(30, 40, 55), font=get_font(17, bold=True), anchor="mm")
    
    # Title Ribbon
    banner_title = "अनुसूचित जनजाति प्रमाण पत्र / SCHEDULED TRIBE CERTIFICATE" if doc_type == "CASTE" else "वार्षिक आय प्रमाण पत्र / ANNUAL INCOME CERTIFICATE"
    draw.rectangle([WIDTH // 2 - 380, 290, WIDTH // 2 + 380, 335], fill=(245, 240, 225), outline=(15, 35, 75), width=2)
    draw.text((WIDTH // 2, 312), banner_title, fill=(15, 35, 75), font=get_font(20, bold=True), anchor="mm")
    
    # 5. Metadata Grid
    draw.line([70, 360, WIDTH - 70, 360], fill=(180, 180, 180), width=1)
    draw.text((70, 375), f"Certificate Ref No: {data['cert_no']}", fill=(20, 20, 20), font=get_font(16, bold=True))
    draw.text((70, 400), f"Application Token: {data['app_id']}", fill=(60, 60, 60), font=get_font(14))
    draw.text((70, 422), f"Revenue Circle: {data['circle']}", fill=(60, 60, 60), font=get_font(14))
    
    draw.text((WIDTH - 70, 375), f"Date of Issue: {data['issue_date']}", fill=(20, 20, 20), font=get_font(16, bold=True), anchor="ra")
    draw.text((WIDTH - 70, 400), f"State: Jharkhand (LGD: 20)", fill=(60, 60, 60), font=get_font(14), anchor="ra")
    draw.text((WIDTH - 70, 422), f"District: {data['district']}", fill=(60, 60, 60), font=get_font(14), anchor="ra")
    draw.line([70, 445, WIDTH - 70, 445], fill=(180, 180, 180), width=1)
    
    # 6. Certificate Main Body Content
    font_body = get_font(18)
    font_bold = get_font(19, bold=True)
    
    y = 480
    if doc_type == "CASTE":
        lines = [
            ("प्रमाणित किया जाता है कि श्री/सुश्री ", data['name'], " सुपुत्र/सुपुत्री श्री ", data['parent']),
            ("ग्राम/मोहल्ला: ", data['village'], " पोस्ट: ", data['post']),
            ("थाना: ", data['thana'], " अंचल: ", data['circle']),
            ("जिला: ", data['district'], " राज्य: ", "झारखण्ड (Jharkhand)"),
            ("", "", "", "")
        ]
        
        draw.text((70, y), "This is to certify that:", fill=(100, 100, 100), font=get_font(15, bold=True))
        y += 30
        
        body_text_1 = (
            f"1. Shri/Kumari {data['name']}, son/daughter of Shri {data['parent']}, resident of Village {data['village']}, "
            f"P.O. {data['post']}, Thana {data['thana']}, Circle {data['circle']}, District {data['district']} in the State of Jharkhand, "
            f"belongs to the {data['caste']} Community."
        )
        # Word wrap text
        import textwrap
        for wrap_line in textwrap.wrap(body_text_1, width=74):
            draw.text((70, y), wrap_line, fill=(20, 25, 35), font=font_body)
            y += 28
            
        y += 20
        body_text_2 = (
            f"2. The {data['caste']} community is recognized as a SCHEDULED TRIBE under The Constitution (Scheduled Tribes) "
            f"Order, 1950, as amended by the Scheduled Castes and Scheduled Tribes Order (Amendment) Act, 2002 for the State of Jharkhand."
        )
        for wrap_line in textwrap.wrap(body_text_2, width=74):
            draw.text((70, y), wrap_line, fill=(20, 25, 35), font=font_body)
            y += 28

        y += 25
        body_text_3 = (
            f"3. Shri/Kumari {data['name']} and their family ordinarily reside in Village {data['village']}, "
            f"District {data['district']} of Jharkhand."
        )
        for wrap_line in textwrap.wrap(body_text_3, width=74):
            draw.text((70, y), wrap_line, fill=(20, 25, 35), font=font_body)
            y += 28

    else: # INCOME CERTIFICATE
        draw.text((70, y), "Revenue Officer Assessment & Enquiry Summary:", fill=(100, 100, 100), font=get_font(15, bold=True))
        y += 30
        
        import textwrap
        body_text_1 = (
            f"This is to certify based on official field enquiries conducted by Halka Karamchari (Halka No. {data.get('halka', '04')}) "
            f"and Circle Inspector that the total annual gross family income of Shri/Kumari {data['name']}, "
            f"son/daughter of Shri {data['parent']}, resident of Village {data['village']}, Block {data['circle']}, "
            f"District {data['district']} (Jharkhand) from all legitimate sources is assessed as under:"
        )
        for wrap_line in textwrap.wrap(body_text_1, width=74):
            draw.text((70, y), wrap_line, fill=(20, 25, 35), font=font_body)
            y += 28
            
        y += 25
        # Official Table of Income Assessment
        draw.rectangle([70, y, WIDTH - 70, y + 170], outline=(15, 35, 75), width=2, fill=(255, 255, 255))
        draw.line([70, y + 40, WIDTH - 70, y + 40], fill=(15, 35, 75), width=2)
        draw.line([WIDTH // 2 + 100, y, WIDTH // 2 + 100, y + 170], fill=(15, 35, 75), width=1)
        
        draw.text((90, y + 12), "Source of Annual Income / आय का स्रोत", fill=(15, 35, 75), font=get_font(16, bold=True))
        draw.text((WIDTH // 2 + 130, y + 12), "Assessed Amount (INR)", fill=(15, 35, 75), font=get_font(16, bold=True))
        
        draw.text((90, y + 55), "1. Agricultural / Land Produce Income", fill=(30, 30, 30), font=font_body)
        draw.text((WIDTH // 2 + 130, y + 55), f"₹ {data.get('agri_income', '1,10,000')}/-", fill=(30, 30, 30), font=font_bold)
        
        draw.text((90, y + 88), "2. Other Sources / Daily Wages / Trade", fill=(30, 30, 30), font=font_body)
        draw.text((WIDTH // 2 + 130, y + 88), f"₹ {data.get('other_income', '70,000')}/-", fill=(30, 30, 30), font=font_bold)
        
        draw.line([70, y + 125, WIDTH - 70, y + 125], fill=(15, 35, 75), width=1)
        draw.text((90, y + 138), "TOTAL GROSS ANNUAL FAMILY INCOME:", fill=(15, 35, 75), font=get_font(17, bold=True))
        draw.text((WIDTH // 2 + 130, y + 138), f"₹ {data['income']}/-", fill=(16, 120, 55), font=get_font(20, bold=True))
        
        y += 190
        validity_note = (
            f"Statutory Validity: This Income Certificate is valid for 12 months from the date of issue ({data['issue_date']}) "
            f"for educational scholarship and state welfare purposes as per Revenue Circular No. 14/Rev/2023."
        )
        for wrap_line in textwrap.wrap(validity_note, width=74):
            draw.text((70, y), wrap_line, fill=(70, 70, 70), font=get_font(15))
            y += 24

    # 7. Stamp, Digital Signature, and QR Code Area
    sig_y = HEIGHT - 330
    
    # Circular Violet Official Rubber Stamp
    draw_circular_stamp(draw, 220, sig_y + 80, 95, data['stamp_title'], data['district'].upper())
    
    # QR Code in middle
    draw_qr_code_mock(draw, 420, sig_y + 20, 120)
    draw.text((480, sig_y + 155), "Scan to Verify on", fill=(100, 100, 100), font=get_font(11), anchor="mm")
    draw.text((480, sig_y + 170), "jharsewa.jharkhand.gov.in", fill=(15, 35, 75), font=get_font(11, bold=True), anchor="mm")
    
    # Digital Signature Box on Right
    draw_digital_signature_box(
        draw, WIDTH - 470, sig_y + 15, 400, 140,
        data['officer_name'], data['officer_title'], data['sign_date'], data['hash']
    )
    
    # 8. Bottom Security Notice
    draw.line([50, HEIGHT - 70, WIDTH - 50, HEIGHT - 70], fill=(200, 200, 200), width=1)
    draw.text((WIDTH // 2, HEIGHT - 52), "Note: This is a digitally signed computer-generated statutory certificate issued under the IT Act 2000.", fill=(110, 110, 110), font=get_font(13), anchor="mm")
    draw.text((WIDTH // 2, HEIGHT - 34), "Physical signature is not required. Verification URL: https://jharsewa.jharkhand.gov.in/verify", fill=(110, 110, 110), font=get_font(12), anchor="mm")
    
    out_path = os.path.join(OUTPUT_DIR, filename)
    img.save(out_path, "PNG", quality=95)
    print(f"Generated authentic certificate: {filename}")

# --- Generate All 6 Real Certificates ---

# 1. Ramesh Soren - Caste Certificate
create_certificate("caste_cert_ramesh_soren.png", "CASTE", {
    "cert_no": "JH/ST/2025/089421",
    "app_id": "APP-JH-2026-00412",
    "name": "RAMESH SOREN",
    "parent": "SOHAN SOREN",
    "caste": "SANTHAL",
    "village": "Dighi (Ward 04)",
    "post": "Kurwa",
    "thana": "Dumka Sadar (Thana No. 128)",
    "circle": "Dumka Sadar",
    "district": "Dumka",
    "issue_date": "15-01-2025",
    "office_name": "अनुमंडल दंडाधिकारी का कार्यालय, दुमका सदर",
    "stamp_title": "OFFICE OF THE SDO",
    "officer_name": "ANIL KUMAR CHOUDHARY",
    "officer_title": "Sub-Divisional Officer, Dumka",
    "sign_date": "15-01-2025 11:24:18 IST",
    "hash": "7a8f4e2190bc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
})

# 2. Ramesh Soren - Income Certificate
create_certificate("income_cert_ramesh_soren.png", "INCOME", {
    "cert_no": "JH/INC/2026/021948",
    "app_id": "APP-JH-2026-00412",
    "name": "RAMESH SOREN",
    "parent": "SOHAN SOREN",
    "income": "1,80,000",
    "agri_income": "1,10,000",
    "other_income": "70,000",
    "village": "Dighi",
    "post": "Kurwa",
    "thana": "Dumka Sadar",
    "circle": "Dumka Sadar",
    "district": "Dumka",
    "issue_date": "20-02-2026",
    "office_name": "अंचल कार्यालय, दुमका सदर (राजस्व शाखा)",
    "stamp_title": "CIRCLE OFFICER DUMKA",
    "officer_name": "RAJESH KUMAR MARANDI",
    "officer_title": "Circle Officer, Dumka Sadar",
    "sign_date": "20-02-2026 14:15:32 IST",
    "hash": "3c98d4128f09bc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852aa"
})

# 3. Sunita Munda - Caste Certificate (with 1-letter clerical typo: Mangraa)
create_certificate("caste_cert_sunita_munda.png", "CASTE", {
    "cert_no": "JH/ST/2024/033109",
    "app_id": "APP-JH-2026-00789",
    "name": "SUNITA MUNDA",
    "parent": "MANGRAA MUNDA", # Typo on cert
    "caste": "MUNDA",
    "village": "Dumduma",
    "post": "Torpa",
    "thana": "Torpa (Thana No. 42)",
    "circle": "Torpa",
    "district": "Khunti",
    "issue_date": "10-05-2024",
    "office_name": "अनुमंडल दंडाधिकारी का कार्यालय, खूंटी",
    "stamp_title": "OFFICE OF THE SDO",
    "officer_name": "PRADEEP KUMAR ORAON",
    "officer_title": "Sub-Divisional Officer, Khunti",
    "sign_date": "10-05-2024 10:18:44 IST",
    "hash": "88ef19a84210bc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852cc"
})

# 4. Sunita Munda - Expired Income Certificate (Issued 10-03-2025 > 12 months ago)
create_certificate("income_cert_sunita_munda.png", "INCOME", {
    "cert_no": "JH/INC/2025/001290",
    "app_id": "APP-JH-2026-00789",
    "name": "SUNITA MUNDA",
    "parent": "MANGRAA MUNDA",
    "income": "1,40,000",
    "agri_income": "90,000",
    "other_income": "50,000",
    "village": "Dumduma",
    "post": "Torpa",
    "thana": "Torpa",
    "circle": "Torpa",
    "district": "Khunti",
    "issue_date": "10-03-2025", # EXPIRED (> 12 months for Jharkhand)
    "office_name": "अंचल कार्यालय, तोरपा, खूंटी",
    "stamp_title": "CIRCLE OFFICER TORPA",
    "officer_name": "SANTOSH KUMAR TUDU",
    "officer_title": "Circle Officer, Torpa",
    "sign_date": "10-03-2025 15:30:19 IST",
    "hash": "4a11b8429010bc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852dd"
})

# 5. Amit Kumar Tirkey - Caste Certificate
create_certificate("caste_cert_amit_tirkey.png", "CASTE", {
    "cert_no": "JH/ST/2025/099182",
    "app_id": "APP-JH-2026-01554",
    "name": "AMIT KUMAR TIRKEY",
    "parent": "SUSHIL TIRKEY",
    "caste": "ORAON",
    "village": "Kanke Basti",
    "post": "Kanke",
    "thana": "Kanke (Thana No. 89)",
    "circle": "Kanke",
    "district": "Ranchi",
    "issue_date": "14-08-2025",
    "office_name": "अनुमंडल दंडाधिकारी का कार्यालय, रांची सदर",
    "stamp_title": "OFFICE OF THE SDO",
    "officer_name": "RAVI SHANKAR VIDYARTHI",
    "officer_title": "Sub-Divisional Officer, Ranchi Sadar",
    "sign_date": "14-08-2025 16:42:11 IST",
    "hash": "11ab99824210bc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852ee"
})

# 6. Amit Kumar Tirkey - Income Certificate
create_certificate("income_cert_amit_tirkey.png", "INCOME", {
    "cert_no": "JH/INC/2026/044812",
    "app_id": "APP-JH-2026-01554",
    "name": "AMIT KUMAR TIRKEY",
    "parent": "SUSHIL TIRKEY",
    "income": "1,95,000",
    "agri_income": "1,20,000",
    "other_income": "75,000",
    "village": "Kanke Basti",
    "post": "Kanke",
    "thana": "Kanke",
    "circle": "Kanke",
    "district": "Ranchi",
    "issue_date": "18-05-2026",
    "office_name": "अंचल कार्यालय, कांके, रांची",
    "stamp_title": "CIRCLE OFFICER KANKE",
    "officer_name": "MANOJ KUMAR BHAGAT",
    "officer_title": "Circle Officer, Kanke",
    "sign_date": "18-05-2026 12:09:55 IST",
    "hash": "99ee44824210bc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852ff"
})

print("All 6 high-fidelity government certificates generated successfully.")
