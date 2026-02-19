// دالة التشغيل الأساسية لتطبيق الويب
function doGet(e) {
  return HtmlService.createTemplateFromFile('index')
      .evaluate()
      .setTitle('حاسبة المعدل الفصلي - مسار بولونيا') // عنوان التبويب
      .addMetaTag('viewport', 'width=device-width, initial-scale=1'); // لدعم الموبايل
}

// دالة لجلب محتوى الملفات الأخرى (CSS و JS)
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}