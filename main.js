document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
      event.preventDefault();
      tambahBuku();
    });
  });

  var buku = [];
  const RENDER_EVENT = 'render-book';
  const localStorageKey = 'PRESS_FREQUENCY';
  
  if (typeof (Storage) !== 'undefined') {
    if (localStorage.getItem(localStorageKey) === null) {
      localStorage.setItem(localStorageKey, buku);
    }
    else{
      var x = JSON.parse(localStorage.getItem(localStorageKey)).length;
  for(let i = 0; i<x; i++){
    buku = JSON.parse(localStorage.getItem(localStorageKey));
    makeBook(JSON.parse(localStorage.getItem(localStorageKey))[i]);
    
  }
    }
    var element = document.getElementsByTagName('button');
    for (var i = 0; i < element.length; i++) {
      element[i].addEventListener('click', function () {
        localStorage.setItem(localStorageKey, JSON.stringify(buku));
      });
  }
  
  } else {
    alert('Browser yang Anda gunakan tidak mendukung Web Storage');
  }


function tambahBuku(){    
    const generatedID = generateId();
    const title = document.getElementById("inputBookTitle").value;
    const author = document.getElementById("inputBookAuthor").value;
    const year = document.getElementById("inputBookYear").value;
    const isComplete = document.getElementById("inputBookIsComplete");
    if(isComplete.checked){
        const bukuObject = generateBukuObject(generatedID,title,author,year,true);
        buku.push(bukuObject);  
    }
    else{
        const bukuObject = generateBukuObject(generatedID,title,author,year,false);
        buku.push(bukuObject);  
    }

  
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function generateId() {
    return +new Date();
  }
   
  function generateBukuObject(id, title, author, year, isComplete) {
    return {
      id, title, author, year, isComplete
    }
  }

  function makeBook(bukuObject) {
    const textTitle = document.createElement('h3');
    textTitle.innerText = bukuObject.title;
   
    const textAuthor = document.createElement('p');
    textAuthor.innerText = "Penulis : " + bukuObject.author;

    const textYear = document.createElement('p');
    textYear.innerText = "Tahun : " + bukuObject.year;
   

    const buttonRead = document.createElement('button');
    buttonRead.classList.add('green');
    buttonRead.setAttribute('id', `read-${bukuObject.id}`);
    if(bukuObject.isComplete){
        buttonRead.appendChild(document.createTextNode("Belum Selesai Dibaca"));
    }
    else{
        buttonRead.appendChild(document.createTextNode("Selesai Dibaca"));
    }

    buttonRead.addEventListener('click', function () {
      addBookToCompleted(bukuObject.id);
    });

    const buttonDelete = document.createElement('button');
    buttonDelete.classList.add('red');
    buttonDelete.appendChild(document.createTextNode("Hapus Buku"));
    buttonDelete.setAttribute('id', `hapus-${bukuObject.id}`);

    buttonDelete.addEventListener('click', function () {
      removeBook(bukuObject.id);
    });

    const actionContainer = document.createElement('div');
    actionContainer.classList.add('action');
    actionContainer.append(buttonRead, buttonDelete);

    const textContainer = document.createElement('article');
    textContainer.classList.add('book_item');
    textContainer.append(textTitle, textAuthor,textYear, actionContainer);
   
    localStorage.setItem(localStorageKey, JSON.stringify(buku));
   
    return textContainer;
  }

  

   
   
  function undoTaskFromCompleted(bookId) {
    const bookTarget = findBook(bookId);
   
    if (bookTarget == null) return;
   
    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  document.addEventListener(RENDER_EVENT, function () {
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    incompleteBookshelfList.innerHTML = '';

    const completeBookshelfList = document.getElementById('completeBookshelfList');
    completeBookshelfList.innerHTML = '';
   
    for (const bookItem of buku) {
      const bookElement = makeBook(bookItem);
      if(bookItem.isComplete){
        completeBookshelfList.append(bookElement);
      }
      else{
        incompleteBookshelfList.append(bookElement);
      }
    }
  });

  window.onload = (event) => {
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    incompleteBookshelfList.innerHTML = '';

    const completeBookshelfList = document.getElementById('completeBookshelfList');
    completeBookshelfList.innerHTML = '';
   
    for (const bookItem of buku) {
      const bookElement = makeBook(bookItem);
      if(bookItem.isComplete){
        completeBookshelfList.append(bookElement);
      }
      else{
        incompleteBookshelfList.append(bookElement);
      }
    }
};


  function addBookToCompleted (bookId) {
    const bookTarget = findBook(bookId);
   
    if (bookTarget == null) return;
   
    if(bookTarget.isComplete){
      bookTarget.isComplete = false;
    }
    else{
      bookTarget.isComplete = true;
    }
    
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

    function removeBook(bookId) {
    const bookTarget = findBook(bookId);
   
    if (bookTarget === -1) return;
   
    buku.splice(bookTarget, 1);
    localStorage.setItem(localStorageKey, buku);
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  function findBook(bookId) {
    for (const bookItem of buku) {
      if (bookItem.id === bookId) {
        return bookItem;
      }
    }
    return null;
  }

  document.addEventListener(RENDER_EVENT, function () {
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    incompleteBookshelfList.innerHTML = '';
   
    for (const bookItem of buku) {
      const bookElement = makeBook(bookItem);
      if (!bookItem.isComplete) {
        incompleteBookshelfList.append(bookElement);
      }
    }
  });
