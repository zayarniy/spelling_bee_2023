function editJSON() {
  // переводим данные от сервера в массив, понятный для JavaScript
  newData = JSON.parse(res).map(Object.values);
  // добавляем к каждому имени число с его длиной в скобках
  for (var i = newData.length - 1; i >= 0; i--) {
    newData[i][0].name = newData[i][0].name + '(' + newData[i][0].name.length + ')';
    console.log(newData[i][0].name);
  }
  // а вот сюда мы поместим ответ от сервера
  let result = document.querySelector('.result');
  // создаём новый экземпляр запроса XHR
  let xhr = new XMLHttpRequest();
  // адрес, куда мы отправим нашу JSON-строку
  let url = "http://mgimo.учисьдома.рф/json.php";
  // открываем соединение
  xhr.open("POST", url, true);
  // устанавливаем заголовок — выбираем тип контента, который отправится на сервер, в нашем случае мы явно пишем, что это JSON
  // xhr.setRequestHeader("Content-Type", "application/json");
  // когда придёт ответ на наше обращение к серверу, мы его обработаем здесь
  xhr.onreadystatechange = function () {
    // если запрос принят и сервер ответил, что всё в порядке
    if (xhr.readyState === 4 && xhr.status === 200) {
      // выводим то, что ответил нам сервер, — так мы убедимся, что данные он получил правильно
      result.innerHTML = this.responseText;
    }
  };
  // преобразуем наши новые данные JSON в строку
  sendData = JSON.stringify(newData);
  // когда всё готово, отправляем JSON на сервер
  xhr.send(sendData);
}


function reqListener() {
   newData = JSON.parse(this.responseText).map(Object.values);
      document.write("<table border='1'>");
     document.write("<tr><td>Школа</td><td>Фамилия</td><td>Имя</td><td>Тема</td><td>Правильных<br>ответов</td><td>Баллов</td><td>начало</td><td>окончание</td><td>продолжительность</td><td>ответы</td></tr>");
  for (var i = newData.length - 1; i >= 0; i--) {
    //newData[i][0].name = newData[i][0].name + '(' + newData[i][0].name.length + ')';      
      document.write("<tr>")
      document.write("<td>"+newData[i][0].schoolname+"</td><td>"+newData[i][0].lastname+"</td><td>"+newData[i][0].name+"</td><td>"+newData[i][0].theme+"</td><td>"+newData[i][0].trueanswers+"</td><td>"+newData[i][0].Points+"</td><td>"+newData[i][0].begin+"</td><td>"+newData[i][0].end+"</td><td>"+Math.floor(newData[i][0].ellipsed/1000)+"</td><td>"+newData[i][0].answers+"</td>")
      document.write("</tr>")
    //console.log(newData[i][0]);
  }
    document.write("</table>")
  console.log(this.responseText);
}

function getData()
{


const req = new XMLHttpRequest();
req.addEventListener("load", reqListener);
req.open("GET", "http://mgimo.учисьдома.рф/data.json");
req.send();
}