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
            } else { 
                var template = '';    
                for(var i = 0; i<response.response.length; i++) {
                    template = template +  '<li data-name="' + response.response[i].first_name + ' ' + response.response[i].last_name + '" class="list-group-item " draggable="true"><div class="row"><div class="col-xs-3"><img draggable="false" src="' + response.response[i].photo_50 +'"/></div><div class="col-xs-7"><span class="title titleLeft"> ' + response.response[i].first_name + ' ' + response.response[i].last_name + '</span></div><div  class="col-xs-2 vcenter"><span class="glyphicon glyphicon-plus"></span></div></div></li>';
                }; 

                resultsLeftUl.innerHTML = template;
                resolve(response);
            };

            if (localStorage.saveRight) {

            var savedListJSON = JSON.parse(localStorage.getItem("saveRight"));

		        for(var i = 0; i< savedListJSON.length; i++) {
		        		for(var j = 0; j < resultsLeftUl.children.length; j ++) {
			        		if(resultsLeftUl.children[j].dataset.name.toLowerCase() === savedListJSON[i]) {
			        			resultsRightUl.appendChild(resultsLeftUl.children[j]);
			        			chengeClass(resultsRightUl.children[i], 'toRight');
			        		}
		        		}
		      	};
    
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
        var curentList = document.getElementById(wraper);

        for(var i = 0; i< curentList.children.length; i++) {
        	var curent  = curentList.children[i];
        	console.log(curent.dataset);
           if((curent.dataset.name.toLowerCase()).indexOf(search) == -1) {
                curent.style.display = 'none';
           } else {
                curent.style.display = 'block';
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
        chengeClass(tergetEl, 'toRight');
    }



    function sort(e) {
        if(e.target.classList.contains('glyphicon-plus')) 
        {
            tergetEl = e.target.closest('li')
            resultsRightUl.appendChild(tergetEl); 
        		chengeClass(tergetEl, 'toRight');                       
        } else if (e.target.classList.contains('glyphicon-minus')) 
        { 
            tergetEl = e.target.closest('li')
            resultsLeftUl.appendChild(tergetEl); 
      			chengeClass(tergetEl, 'toLeft');                        
        } 

    }

    function remember() {

      	var saveRightUl = [];
        var saveList = document.getElementById('resultsRightUl');
        var saveLocalStorage = '';
        		console.log(saveList);
        for(var i = 0; i< saveList.children.length; i++) {
        		saveRightUl[saveRightUl.length]  = saveList.children[i].dataset.name.toLowerCase();
      	}

      	saveLocalStorage = JSON.stringify(saveRightUl); 
      	var saveRightUl = localStorage.setItem("saveRight", saveLocalStorage);
    }

 })
 .catch(function(e) {
        alert('Ошибка: ' + e.message);
});

    


function chengeClass(friend, direction) {
    var arrTitle = friend.querySelector('.title');
    var arrIcons = friend.querySelector('.glyphicon');
        if(direction == 'toRight') {
            arrTitle.className = 'title titleRight'; 
            arrIcons.className = 'glyphicon glyphicon-minus'; 
        } else {   
            arrTitle.className = 'title titleLeft'; 
            arrIcons.className = 'glyphicon glyphicon-plus'; 
        };            
}