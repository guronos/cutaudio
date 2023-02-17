  const BASE_URL = 'http://api.audiocut.ru:5000'
  function uploadAndConvert(){
    const timeBegin = document.getElementById('time-begin').value;
    const timeEnd = document.getElementById('time-end').value;
    const file = document.getElementById('formFile').files[0];
    const myHeaders = { headers: {'Access-Control-Allow-Origin' : '*',
      'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS', 'access-control-max-age':'7200', 'cache-control':'max-age=0, private, must-revalidate', 'content-type':'application/json; charset=utf-8'},};
      const formData = new FormData();
        formData.append('file', file);
        console.log(file.size)
console.log("Loading")
// ---------------Validation
if (file==undefined){
  $("#formFile").notify("Выберите файл!");
  return
}
if (file.size >= 15728640) {
  $("#formFile").notify("Файл превышает допустимый размер!");
  return
}
if (!timeBegin.length){
  $("#time-begin").notify("Укажите время начала нового файла!");
  return
}
if (!timeEnd.length){
  $("#time-end").notify("Укажите время окончания нового файла!");
  return
}
// ----------------
  elResult = document.querySelector('#forma');
  elResult.textContent = 'Обработка...';
    // ----------------------
      axios.post(BASE_URL+'/uploadfile/', 
      formData
      , myHeaders)
      .then(function (response) {
        axios.post(`${BASE_URL}/convert`, {
          time_begin: timeBegin,
          time_end: timeEnd,
          file_name: response.data
        }, myHeaders)
        .then(function (response) {
          console.log(response.data);
          if (response.data.status==="ErrorFile"){
            elResult.textContent = 'Произошла ошибка. Некорректное расширение файла.';
            repeatDownloadFileButton=document.querySelector('#butt').classList.remove('hide')
          } else if (response.data.status==="ErrorConverter"){
            elResult.textContent = 'Произошла ошибка. Проверьте корректность заполнения полей вренени.';
            repeatDownloadFileButton=document.querySelector('#butt').classList.remove('hide')
          } else {
            if (response.data.statuse === 'ErrorUploadFile'){
              elResult.textContent = 'Произошла нетипичная ошибка. Проверьте корректность заполнения полей или попробуйте позже.';
              repeatDownloadFileButton=document.querySelector('#butt').classList.remove('hide')
            } else {
          const cutFileName = response.data
          localStorage.setItem('cutFileName', cutFileName);
          elResult.textContent = 'Выполнено';
          downloadFileButton=document.querySelector('#button4').classList.remove('hide');
      }}})
        .catch(function (error) {
          console.log(error);
      });
        console.log(response);
      })
      .catch(function (error) {
        console.log(error); 
    });
    }

    async function downloads() {
      const fileDone = localStorage.getItem('cutFileName');
      const method = 'GET';
    const url = `${BASE_URL}/download?cut_file=${fileDone}`;
     axios
      .request({
        url,

        method,

        responseType: 'blob', 
       })
       .then(({ data }) => {
        if (data.status==="ErrorDownload"){
          elResult.textContent = 'Произошла ошибка загрузки. Попробуйте позже.';
          repeatDownloadFileButton=document.querySelector('#butt').classList.remove('hide')
        }
        else {
        const downloadUrl = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', `file.mp3`); 
        document.body.appendChild(link);
        link.click();
        link.remove();
    }})
      .catch(function (error) {
        elResult.textContent = 'Произошла неизвестная ошибка. Повторите попытку.'
        downloadFileButton=document.querySelector('#button4').classList.add('hide');
        repeatDownloadFileButton=document.querySelector('#butt').classList.remove('hide')
    });
    }
    document.addEventListener('DOMContentLoaded', function(){ 
      console.log('ready')
     });