/**
 * GOOGLE APPS SCRIPT CODE
 * 
 * Instructions:
 * 1. Open a Google Sheet.
 * 2. Rename 'Sheet1' to 'GeneralInfo' and 'Sheet2' to 'Survey'.
 * 3. In Google Sheets, go to Extensions > Apps Script.
 * 4. Paste this code.
 * 5. Update the headers in the sheet to match the fields (optional, script handles it).
 * 6. Click 'Deploy' > 'New Deployment'.
 * 7. Select type 'Web App'.
 * 8. Set 'Execute as' to 'Me' and 'Who has access' to 'Anyone'.
 * 9. Copy the Web App URL and paste it into your .env as VITE_GAS_URL.
 */

function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("GeneralInfo");
  if (!sheet) return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON);
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1);
  
  const result = rows.map((row, index) => {
    let obj = { id: index + 2 }; // Row number in sheet for easy reference
    headers.forEach((header, i) => {
      obj[header] = row[i];
    });
    return obj;
  });
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const action = data.action || "insert";
    
    // --- ADMIN ACTIONS ---
    if (action === "update") {
      const sheetContent = ss.getSheetByName("GeneralInfo");
      const rowNum = data.id;
      const headers = sheetContent.getRange(1, 1, 1, sheetContent.getLastColumn()).getValues()[0];
      const newRowContent = headers.map(h => data.data[h] || "");
      sheetContent.getRange(rowNum, 1, 1, headers.length).setValues([newRowContent]);
      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Update success" })).setMimeType(ContentService.MimeType.JSON);
    }
    
    if (action === "delete") {
      const sheetContent = ss.getSheetByName("GeneralInfo");
      sheetContent.deleteRow(data.id);
      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Delete success" })).setMimeType(ContentService.MimeType.JSON);
    }

    // --- ORIGINAL REGISTRATION LOGIC ---
    const sheet1 = ss.getSheetByName("GeneralInfo") || ss.insertSheet("GeneralInfo");
    if (sheet1.getLastRow() === 0) {
      sheet1.appendRow([
        "Timestamp", "Name", "Nickname", "Age", "ID Number", "Birth Date", "Address", 
        "Phone", "Emergency Phone", "Relationship", "Marital Status", "Religion", 
        "Education", "Health Conditions", "Weight", "Height", "Diet", "Allergies", 
        "Former Occupation", "Current Occupation", "Special Skills", "Transportation", "Landmarks"
      ]);
    }
    
    const gen = data.general;
    const newRow = [
      new Date(), gen.fullName, gen.nickname, gen.age, gen.idNumber, gen.birthDate, gen.address,
      gen.phone, gen.emergencyPhone, gen.emergencyRelationship, gen.maritalStatus, gen.religion,
      gen.education, gen.healthConditions, gen.weight, gen.height, gen.diet, gen.allergies,
      gen.formerOccupation, gen.currentOccupation, gen.specialSkills, gen.transportationNeeds, gen.nearbyLandmarks
    ];
    sheet1.appendRow(newRow);
    
    // Highlight Health Conditions and Allergies in red if not empty
    const lastRow = sheet1.getLastRow();
    if (gen.healthConditions) {
      sheet1.getRange(lastRow, 14).setFontColor("red").setFontWeight("bold");
    }
    if (gen.allergies) {
      sheet1.getRange(lastRow, 18).setFontColor("red").setFontWeight("bold");
    }

    // Part 2: Survey
    const sheet2 = ss.getSheetByName("Survey") || ss.insertSheet("Survey");
    if (sheet2.getLastRow() === 0) {
      sheet2.appendRow([
        "Timestamp", "Schedule Preference", "M1 Health", "M2 Economy", "M3 Culture", 
        "M4 Social", "M5 Tech", "M6 Welfare", "Other Interests", "Reasons", "Source", "Suggestions"
      ]);
    }

    const sur = data.survey;
    sheet2.appendRow([
      new Date(), sur.schedulePreference, sur.m1_interests.join(", "), sur.m2_interests.join(", "), 
      sur.m3_interests.join(", "), sur.m4_interests.join(", "), sur.m5_interests.join(", "), 
      sur.m6_interests.join(", "), sur.otherInterests, sur.reasonsForApplying.join(", "), 
      sur.sourceOfInfo.join(", "), sur.otherSuggestions
    ]);

    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
