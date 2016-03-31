 new Promise(function(resolve) {
    if(document.readyState === 'complete') {
        resolve();
    } else {
        window.onload = resolve;
    }

 }).then(function() {
    return new Promise(function(resolve, reject) {
        VK.init({
            apiId: 5373554
        });

        VK.Auth.login(function(response) {
            if (response.session) {
                resolve(response);
            } else {
                reject(new Error('Не удалось авторизоваться'));
            }
        }, 8|4);
    });
 }).then(function() {
    return new Promise( function(resolve, reject) {
       
        VK.api('users.get', {'name_case': 'gen'}, function(response) {
            console.log(response);            
            if(response.error) {
                reject(new Error(response.error.error_msg));
            } else {
                headerInfo.textContent = 'Друзья ' + response.response[0].first_name + ' ' + response.response[0].last_name;
                resolve();
            }

        });
    });
    
 }).then(function() {
    return new Promise( function(resolve, reject) {
       
        VK.api('friends.get', {'fields': 'photo_50'}, function(response) {
            if (response.error) {
                reject(new Error(response.error.error_msg));
            } else if (!localStorage.length){ 
                var template = '';    
                for(var i = 0; i<response.response.length; i++) {
                    template = template +  '<li class="list-group-item " draggable="true"><div class="row"><div class="col-xs-3"><img draggable="false" src="' + response.response[i].photo_50 +'"/></div><div class="col-xs-7"><span class="title titleLeft"> ' + response.response[i].first_name + ' ' + response.response[i].last_name + '</span></div><div  class="col-xs-2 vcenter"><span class="glyphicon glyphicon-plus"></span></div></div></li>';
                }; 

                resultsLeftUl.innerHTML = template;
                resolve(response);
            } else if (localStorage.length) {
                resultsLeftUl.innerHTML = localStorage.getItem("saveLeft");
                resultsRightUl.innerHTML = localStorage.getItem("saveRight");                
                resolve(response);               
            }

        });
    });
    
 }).then(function(response) {
    filterLeft.addEventListener('input', filter);
    filterRight.addEventListener('input', filter);
    drugSection.addEventListener('click', sort);
    save.addEventListener('click', remember);            
    resultsRight.addEventListener('drop', drop);
    resultsRight.addEventListener('dragover', allowDrop);
    resultsLeft.addEventListener('dragstart', drag);          
    var tergetEl;

    function filter() {
        var search = this.value.trim();
        var wraper = this.getAttribute('data-val');
        var curentName = document.getElementsByClassName(wraper);

        console.log(wraper);
        for(var i = 0; i< curentName.length; i++) {
           if((curentName[i].innerHTML.toLowerCase()).indexOf(search) == -1) {
                curentName[i].closest('li').style.display = 'none';
           } else {
                curentName[i].closest('li').style.display = 'block';
           }        
        }  
    }

    function allowDrop(e) {
        e.preventDefault();
    }

    function drag(e) {
        tergetEl = e.target;
    }

    function drop(e) {
        resultsRightUl.appendChild(tergetEl);
        chengeClass();
    }


    function sort(e) {
        if(e.target.classList.contains('glyphicon-plus')) 
        {
            tergetEl = e.target.closest('li')
            resultsRightUl.appendChild(tergetEl);            
        };

        if(e.target.classList.contains('glyphicon-minus')) 
        { 
            tergetEl = e.target.closest('li')
            resultsLeftUl.appendChild(tergetEl);            
        } 
        chengeClass(); 
    }

    function chengeClass() {
        var arrTitle = document.getElementsByClassName('title');
        var arrIcons = document.getElementsByClassName('glyphicon');

        for(var i = 0; i< arrTitle.length; i++) {
            if(arrTitle[i].closest('ul').id == 'resultsRightUl') {
                arrTitle[i].className = 'title titleRight'; 
                arrIcons[i].className = 'glyphicon glyphicon-minus'; 
            } else if(arrTitle[i].closest('ul').id == 'resultsLeftUl') {   
                arrTitle[i].className = 'title titleLeft'; 
                arrIcons[i].className = 'glyphicon glyphicon-plus'; 
            };            
        }
    }

    function remember() {
       var saveLeftUl = localStorage.setItem("saveLeft", resultsLeftUl.innerHTML);
       var saveRightUl = localStorage.setItem("saveRight", resultsRightUl.innerHTML);
    }

 })
 .catch(function(e) {
        alert('Ошибка: ' + e.message);
});

