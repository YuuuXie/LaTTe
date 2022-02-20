/*
Notes
https://developers.google.com/apps-script/guides/slides/presentations

https://developers.google.com/apps-script/reference/slides/slides-app
*/
/*            
very cool example             
https://chrome.google.com/webstore/detail/equatio-math-made-digital/hjngolefdpdnooamgdldlkjgmdcmcjnc            
*/

function PropertiesTypes(){
 
  return {
     "imageProperties":{}
   }
}

function onOpen() {
  SlidesApp.getUi().createMenu('LaTTe')
      .addItem('Menu', 'showSidebar')
      //.addItem('Refresh Data', 'loadDataToSpreadSheet')
      .addToUi();
   Logger.log("started");
}


function showSidebar() {
  
  var html = doGet().setTitle('LaTTe UI').setWidth(300);
  SlidesApp.getUi() // Or DocumentApp or FormApp.
      .showSidebar(html);
}

function onInstall(){
  onOpen();
}


function doGet() {
  return HtmlService
      .createTemplateFromFile('index')
      .evaluate();
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}
