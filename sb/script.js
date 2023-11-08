var _words = [];
var attempts = [];
var timeBegin, timeEnd, timeSpan;
var answersLine = "";
var theme = "";
var levelsPoint = [5 ,10, 15]
var countSubmit=0
var title="Spelling Bee Training 2023"

const synth = window.speechSynthesis;



function checkAnswers()
{
    countSubmit++;
    answers=document.getElementsByClassName("input_answer")
    countAnswers=0;
    countTrueAnswers=0;
    answersLine=""
    charTrue=""
    countPoints=0
    for(i=0;i<answers.length;i++)
        {
            if (answers[i].value!="")
                countAnswers++;
            if (answers[i].value.trim().toLowerCase()==_words[i].toLowerCase())
                {
                    answers[i].style.color="green"
                    countTrueAnswers++;
                    countPoints+=levelsPoint[Math.floor(i/10)]
                    charTrue="+"
                }
            else
                {
                    if (answers[i].value=="") 
                    {
                        charTrue=""
                         answers[i].style.color="black"
                    }
                    else
                    {
                      answers[i].style.color="red"
                      charTrue="-"
                    }
                }
            answersLine+=(i+1)+". "+answers[i].value+charTrue+ ";"
        }
    document.getElementById("count_answers").innerHTML=countAnswers
    document.getElementById("count_true_answers").innerHTML=countTrueAnswers
    document.getElementById("count_balls").innerHTML=countPoints;
    document.getElementById("count_submit").innerHTML=countSubmit;
    
    
}

function time_Begin()
{
    timeBegin = new Date();
    var n = timeBegin.toLocaleTimeString();
    document.getElementById("time_begin").innerHTML=n;
}
function time_End()
{
    timeEnd = new Date();
    var n = timeEnd.toLocaleTimeString();
    document.getElementById("time_end").innerHTML=n;
}

function time_Span()
{
    var diff = timeEnd.getTime() - timeBegin.getTime();
/*
    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -=  days * (1000 * 60 * 60 * 24);

    var hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);

    var mins = Math.floor(diff / (1000 * 60));
    diff -= mins * (1000 * 60);

    var seconds = Math.floor(diff / (1000));
    diff -= seconds * (1000);*/
    timeSpan=diff;//hours+":"+mins+":"+seconds;
    document.getElementById("time_span").innerHTML=Math.floor(timeSpan/1000)+" sec";
}





function populateVoiceList() {
  voices = synth.getVoices()//.filter(voice=>voice.name.includes("en"))
  voices=voices.filter(a=>a.lang.includes("en") && a.lang.includes("GB"))
}

let voices = [];
time_Begin();
Init();

populateVoiceList();

if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

function Start()
{
    //alert('start')
    if(checkInputData()==false) return    
    document.getElementById("div_all_parts").style.visibility='visible'
}

function Attempt(n)
{
    if (attempts[n]==undefined)
        {
            attempts[n]=1;
        }
    else
    {
        attempts[n]++;
    }
    document.getElementById("c"+n).innerHTML=attempts[n]
}
function speak2(n) {
    if (attempts[n]==3) {
        swal("Sorry, only 3 times")
        return;
    }
    if (synth.speaking) {
      console.error("speechSynthesis.speaking");
      return;
    }

  
    const utterThis = new SpeechSynthesisUtterance("                        "+_words[n-1]);
    utterThis.onend = function (event) {
      console.log("SpeechSynthesisUtterance.onend");
    };
    utterThis.onerror = function (event) {
      console.error("SpeechSynthesisUtterance.onerror");
    };
    utterThis.voice=voices[0]
    utterThis.pitch = 1;
    utterThis.rate = 0.8;
    utterThis.lang="en-GB";
    synth.speak(utterThis);
    Attempt(n)
  
}

function send()
{
    time_End();
    time_Span();
    checkAnswers()
    sendJSON();
    sendJSONToDB();
}

function checkInputData()
{
  let name = document.querySelector('#input_first_name').value;
  let lastname = document.querySelector('#input_last_name').value;
  if (name=="")
      {
          sweetAlert("Input first name");
          return false;
      }
  if (lastname=="")
      {
          sweetAlert("Input last name");
          return false;
      }
  
  let schoolname=document.querySelector('#select_schoolname').value;
  let input_schoolname=document.getElementById("input_schoolname").value
//swal(schoolname);
  if (schoolname=="Select a school")  
      {
          sweetAlert("Select a school");
          return false;
      }    
    if (schoolname=='Other' && input_schoolname=='')
        {
          sweetAlert("Input a school name");
          return false;
            
        }
}

  <!-- скрипт, который обработает нажатие на кнопку и отправит данные на сервер -->
var res;
var newData;
var sendData;

function SelectChange()
{
    //alert(document.getElementById('select_schoolname').value)
    if (document.getElementById('select_schoolname').value=='Other')
        {
            document.getElementById('input_schoolname').style.visibility='visible';
        }
    else
        {
            let input_schoolname=document.getElementById('input_schoolname');
            input_schoolname.style.visibility='hidden';
            input_schoolname.value=''
            
        }
}
// эта функция сработает при нажатии на кнопку

function sendJSON() {
  // с помощью jQuery обращаемся к элементам на странице по их именам
  let name = document.querySelector('#input_first_name').value;
  let lastname = document.querySelector('#input_last_name').value;
  /*if (name=="" || lastname=="")
      {
          swal("Input name");
          return;
      }
  */
  let schoolname=document.querySelector('#select_schoolname').value;
  /*if (schoolname=="Select a school")  
      {
          swal("Select a school");
          return;
      }*/
  let result = document.querySelector('#send_status');
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
      // запоминаем данные, которые пришли с сервера
      //res = this.responseText;
      // выводим то, что ответил нам сервер — так мы убедимся, что данные он получил правильно
      result.innerHTML = "Submit"//this.responseText;
        result.style.color="green"
        //sweetAlert("Answers saved")
    }
      
      else{
          //sweetAlert("the results were not saved. Please take a photo of your results")
          result.style.color='red'
          result.innerHTML = "Error"//this.responseText;
      }
  };
  // преобразуем наши данные в JSON-строку
  data = JSON.stringify({"schoolname":schoolname,"theme":theme, "name": name, "lastname": lastname,"trueanswers":String(countTrueAnswers),"Points":String(countPoints), "begin":timeBegin,"end":timeEnd,"ellipsed":timeSpan, "answers":answersLine});
  // когда всё готово, отправляем JSON на сервер
  xhr.send(data);
}

function sendJSONToDB() {
  // с помощью jQuery обращаемся к элементам на странице по их именам
  let name = document.querySelector('#input_first_name').value;
  let lastname = document.querySelector('#input_last_name').value;

  let schoolname=document.querySelector('#select_schoolname').value;
  let result = document.querySelector('#send_status');
  // создаём новый экземпляр запроса XHR
  let xhr = new XMLHttpRequest();
  // адрес, куда мы отправим нашу JSON-строку
  let url = "http://mgimo.учисьдома.рф/db_insert.php";
  // открываем соединение
  xhr.open("POST", url, true);
  // устанавливаем заголовок — выбираем тип контента, который отправится на сервер, в нашем случае мы явно пишем, что это JSON
  // xhr.setRequestHeader("Content-Type", "application/json");
  // когда придёт ответ на наше обращение к серверу, мы его обработаем здесь
  xhr.onreadystatechange = function () {
    // если запрос принят и сервер ответил, что всё в порядке
    if (xhr.readyState === 4 && xhr.status === 200) {
      // запоминаем данные, которые пришли с сервера
      //res = this.responseText;
      // выводим то, что ответил нам сервер — так мы убедимся, что данные он получил правильно
      result.innerHTML = "Submit to DB"//this.responseText;
        result.style.color="green"
       // sweetAlert(this.responseText);
    }
      
      else{
          //sweetAlert("the results were not saved. Please take a photo of your results")
          result.style.color='red'
          result.innerHTML = "Error to DB"//this.responseText;
      }
  };
  // преобразуем наши данные в JSON-строку
  data = JSON.stringify({"schoolname":schoolname,"theme":theme, "name": name, "lastname": lastname,"trueanswers":String(countTrueAnswers),"Points":String(countPoints), "begin_time":timeBegin,"end_time":timeEnd,"ellipsed":timeSpan, "answers":answersLine});
  // когда всё готово, отправляем JSON на сервер
  xhr.send(data);
}

var AllWords;


function Init()
{
    
    InitWords();
    let result = document.querySelector('#send_status');
    result.innerHTML=""
    theme=document.getElementById("theme").innerHTML    
    document.getElementById("sb_title").innerHTML=title
    
    _words=AllWords[theme.toLocaleLowerCase()]    
    schools=[
        'АНОО "Частная школа Вектор"',
        'МБОУ "Математическая школа №1 им. Х.И. Ибрагимова ',
        'МБОУ  СОШ №7',
        'Частная школа "Олим-Плюс"',        
        'Горчаковский Лицей МГИМО',
        'ЧОУ «Газпром Школа» (Санкт-Петербург)',
        'ГБОУ "Гимназия №116"',
        'Сборная команда «Движение первых»',        
        'Частная международная школа им. А.С.Пушкина',
        'Лицей МГИМО в Ташкенте',
        'International House Tashkent',
        'Гимназия им. Ю.А.Гарнаева',
        'ИРО Сахалинской области',        
         'ГБОУ СОШ 619(корпус Ч)',
        'ГБОУ СОШ 619(корпус К)',
        'Международная школа имени А.С. Пушкина',
        'МОУ «Гимназия имени Героя Советского Союза Ю.А. Гарнаева»',
        'ГБОУ школа №169',
        'Сборная г. Обнинск'             
        ]
    schools=schools.sort();
    schools.unshift('Select a school')
    schools.push('Other');
    select=document.getElementById('select_schoolname');
    for(var i=0;i<schools.length;i++)
        {
            var opt=document.createElement("option");
            opt.value = schools[i]
            opt.innerHTML=schools[i]
            select.appendChild(opt)
        }
    describes=document.getElementsByClassName("td_describe");
    for(var i=0;i<describes.length;i++)
        describes[i].innerHTML="Click on the image, listen and type in small letters  You can listen to each word only three times."
    questImages=document.getElementsByClassName("image_quest")
    for(var i=0;i<questImages.length;i++)
        questImages[i].src="images/"+theme.toLocaleLowerCase()+"/"+(i+1)+".jpg"
}

