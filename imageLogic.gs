function setImage(jsonImageData){  
  var slide = SlidesApp.getActivePresentation().getSelection().getCurrentPage();
  // if the equation was not linked
  var shape;

  if(jsonImageData["linkedMathEquation"] != ""){
    var imageObjectId = jsonImageData["linkedMathEquation"];
    shape = findImageSlide(imageObjectId);
  } else{
    shape = slide.insertShape(SlidesApp.ShapeType.TEXT_BOX, 100, 200, 300, 60);
  }
  var textRange = shape.getText();
  textRange.setText('Hello world!');

  Logger.log('Start: ' + textRange.getStartIndex() + '; End: ' +
      textRange.getEndIndex() + '; Content: ' + textRange.asString());
  var subRange = textRange.getRange(0, 5);
  Logger.log('Sub-range Start: ' + subRange.getStartIndex() + '; Sub-range End: ' +
      subRange.getEndIndex() + '; Sub-range Content: ' + subRange.asString());
  return shape.getObjectId();

}

function addAltText(jsonImageData, objectId) 
{
  var shape = findImageSlide(objectId);
  shape.setTitle(createAltTitle(jsonImageData));
  shape.setDescription(jsonImageData["mathEquation"]);
  var textRange = shape.getText();
  textRange.setText('');
  textRange.set
  mapStyle(jsonImageData["mathEquation"], textRange);
}

function replace(inputEq){
  // escape combining marks with a space after the backslash
  var outputEq = inputEq;
  for (var i = 0; i < COMBININGMARKS.length; i++) {
    var c = COMBININGMARKS[i];
    outputEq = outputEq.replaceAll(c[0] + '\{', '\\ ' + c[0].slice(1, c[0].length) + '{');
  }

  // replace
  for (var i = 0; i < REPLACEMENTS.length; i++) {
    var r = REPLACEMENTS[i];
    outputEq = outputEq.replaceAll(r[0], r[1]);

    // check whether it was escaped for combining marks but has empty braces
    if (r[0].match('\{\}$')){
      outputEq = outputEq.replace('\\ ' + r[0].slice(1, r[0].length), r[1]);
    }
  }
  // console.log('outputEq=%s', outputEq);

  // process combining marks first
  for (var j = 0; j < COMBININGMARKS.length; j++) {
    var c = COMBININGMARKS[j];
    var escaped_latex = '\\ ' + c[0].slice(1, c[0].length) + '\{';
    while (outputEq.match(escaped_latex)){
      var i = outputEq.indexOf(escaped_latex);
      if (outputEq.length <= i + escaped_latex.length) {
        outputEq = outputEq.slice(0, i) + c[0] + '\{';
        continue;
      }
      var combined_char = outputEq[i + escaped_latex.length];
      var remainder = '';
      if (outputEq.length >= i + escaped_latex.length + 2){
        remainder = outputEq.slice(i + escaped_latex.length + 2, outputEq.length);
      }

      outputEq = outputEq.slice(0, i) + combined_char + c[1] + remainder;
    }
  }
  return outputEq;
}

// // for debug
// var outputEq = replace('\\mathbf{A}');
// console.info('outputEq %s %d %d', outputEq, outputEq.length, '𝐀'.length);
// // console.info('outputEq[0]=%s, outputEq[1]=%s', outputEq[0], outputEq[1]);
// for (var s = 0; s < outputEq.length; s++){
//   if(outputEq.slice(s, s+2).match(/^(?=.*[𝐀])[𝐀]+$/)){
//     console.info('match s, s+2 %d %s', s, outputEq.slice(s, s+2));
//   } else if (outputEq.slice(s-1, s+1).match(/^(?=.*[𝐀])[𝐀]+$/)) {
//     console.info('match s-1, s+1', outputEq.slice(s-1, s+1));
//   } else {
//     console.info('not match s');
//   }
// }
// if(outputEq.match(/^(?=.*[𝐀𝐳])[𝐀𝐳]+$/)){
//   console.info('match %s ', outputEq);
// } else {
//   console.info('not match');
// }

function mapStyle(inputEq, textRange){
  var equation1 = '';
  var flag_list = [];

  var s = 0;
  var equation2 = replace(inputEq);

  s = 0;
  // Generate a string of unicode characters
  while (s < equation2.length) {
    var new_s = s;

    // superscripts and subscripts
    if(equation2[s].match(/^(?=.*[\^])[\^]+$/)){ // superscript

      if(equation2[s+1].match(/^(?=.*[\{])[\{]+$/)){ // multiple characters starting with "{"
        new_s = groupInBracket(equation2, s);
        for (var u = s+2; u < new_s - 1; u++) {
          equation1 = equation1 + equation2[u];
          flag_list.push('superscript');
        }
        s = new_s;
      } else { // single superscript character without "{}"
        equation1 = equation1 + equation2[s+1];
        flag_list.push('superscript');
        s = s + 2;
      }

    } else if (equation2[s].match(/^(?=.*[_])[_]+$/)) { // superscript

      if(equation2[s+1].match(/^(?=.*[\{])[\{]+$/)){ // multiple characters starting with "{"
        new_s = groupInBracket(equation2, s);
        for (var u = s+2; u < new_s - 1; u++) {
          equation1 = equation1 + equation2[u];
          flag_list.push('subscript');
        }
        s = new_s;
      } else { // single superscript character without "{}"
        equation1 = equation1 + equation2[s+1];
        flag_list.push('subscript');
        s = s + 2;
      }

    } else {
      equation1 = equation1 + equation2[s];
      flag_list.push('normal');
      s = s + 1;
    }

  }

  var equation = equation1;

  // Adjust text style
  var jump = false;
  for (var s = 0; s < equation.length; s++){
    if (jump) {
      jump = false;
      continue;
    }
    // Default style settings
    var fontfamily = 'Libre Baskerville';
    var italic = false;
    var bold = false;
    var fontsize = 14;
    var insertedText;

    if(equation.slice(s, s+2).match(/^(?=.*[𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ])[𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ]+$/)){ // These unicodes (for mathbf, mathbb) are actually of length 2
      // equation[s] = 'A';
      // bold = true;
      insertedText = textRange.appendText(equation.slice(s, s+2));
      jump = true;
    } else {
      if(equation[s].match(/^(?=.*[A-Za-z])[A-Za-z]+$/)){ // Letters are italic
        italic = true;
      } else if(equation[s].match(/^(?=.*[0-9])[0-9]+$/)){ // Digits use a different font
        fontfamily = 'Times New Roman';
      } else if(equation[s].match(/^(?=.*[\u03b1-\u03c9])[\u03b1-\u03c9]+$/)){ // Greek letters
        fontfamily = 'Cambria Math';
        italic = true;
      } else if(equation[s].match(/^(?=.*[\u2211\u220f])[\u2211\u220f]+$/)){ // Operators: sum, prod
        fontfamily = 'Times New Roman';
        fontsize += 4;
      } else if(equation[s].match(/^(?=.*[\u222b])[\u222b]+$/)){ // Operators: int
        fontfamily = 'Cambria Math';
        fontsize += 2;
      }
      insertedText = textRange.appendText(equation[s]);
    }

    // textRange.appendText(flag_list[s]);
    // textRange.appendText(cmd_list[s]);

    insertedText.getTextStyle()
      .setItalic(italic)
      .setBold(bold)
      .setFontFamily(fontfamily)
      .setFontSize(fontsize);

    // set superscript/subscript
    var baselineoffset = insertedText.getTextStyle().getBaselineOffset();
    if(flag_list[s] == 'superscript'){
      insertedText.getTextStyle()
        .setBaselineOffset(baselineoffset.SUPERSCRIPT);
    } else if(flag_list[s] == 'subscript'){
      insertedText.getTextStyle()
        .setBaselineOffset(baselineoffset.SUBSCRIPT);
    } else if(flag_list[s] == 'normal'){
      insertedText.getTextStyle()
        .setBaselineOffset(baselineoffset.NONE);
    }

  }
  
}

function groupInBracket(inputEq, s){
  var correctSyntax = false;
  var new_s = s;
  for (var u = s + 2; u < inputEq.length; u++) {
    if(inputEq[u].match(/^(?=.*[\}])[\}]+$/)){ // multiple characters ending with "}"
      new_s = u + 1;
      correctSyntax = true;
      break;
    }
  }
  if(correctSyntax != true){
    throw Error;
  }
  return new_s;
}

function createImageFromBlob(blob){
  return Utilities.newBlob(Utilities.base64Decode(blob), MimeType.PNG);  
}

function findImageSlide(imageObjectId){
  var slide = SlidesApp.getActivePresentation().getSelection().getCurrentPage();
  // var allImage = slide.getImages();
  var allImage = slide.getShapes();
  var imageSlide = undefined;
  for(var i = 0; i < allImage.length; i++){
    if(allImage[i].getObjectId() == imageObjectId){
      imageSlide = allImage[i]
    }
  }
  if(imageSlide == undefined){
    throw "couldn't find the id on this slide"
  }
  return imageSlide;
}

function getLinkedToImage(){ 
  var imageProperties = getSpecificSavedProperties("imageProperties");
  var selection = SlidesApp.getActivePresentation().getSelection();
  var selectionRange = selection.getPageElementRange();
 
  if(selectionRange == null)            
    throw "you need to select a image to reload the equation back into the text box"    
    
  var pageElements = selectionRange.getPageElements();
  
  if(pageElements.length <= 0)
    throw "please select a item"
  else if(pageElements.length >= 2)
    throw "can only select one item"
    
    
  // var image = pageElements[0].asImage();
  var image = pageElements[0].asShape();
  
  
  var imageProperties;
  {
    //old way of loading image
    imageProperties = imageProperties[image.getObjectId()]
    if(imageProperties == undefined)
    {
      var altTextTitle = image.getTitle(); //getText().asString();
      // var altTextTitle = image.getTitle();
      console.info('image id %s', image.getObjectId());
      console.info('altTextTitle %s', altTextTitle);
      imageProperties = getAltTextData(altTextTitle);
      imageProperties["equation"] = image.getDescription();
    }
  }

  if (imageProperties["equationColor"] == undefined &&
      imageProperties["equationColor"] == null){
    imageProperties["equationColor"] = "#000000";
  }
  return {
      "objectId": image.getObjectId(),
      "equation":  imageProperties["equation"],
      "equationColor": imageProperties["equationColor"],
      "equationSize": image.getHeight()
  }
}


function test(){
  Logger.log(getSpecificSavedProperties("imageProperties"))
}

function createAltTitle(jsonImageData){
  return "MathEquation,"+ jsonImageData["mathEquationColor"];
}

function getAltTextData(altTextTitle){
  if(altTextTitle.search("MathEquation") == -1){
    throw "Alt Text data doesn't match";
  }
  var splitData = altTextTitle.split(",");
  
  return {
    "equationColor": splitData[1]
  }
  
}