document.addEventListener('DOMContentLoaded', () => {
  
    let table = document.querySelector('#table-body')
    let nameInput = document.querySelectorAll('input')[0]
    let breedInput = document.querySelectorAll('input')[1]
    let sexInput = document.querySelectorAll('input')[2]
    let form = document.querySelector('form')
    

//on page load render registered dogs   
    
    function getDogs(){
        return fetch('http://localhost:3000/dogs').then(res=>res.json())
    }
    function renderDogs(data){
        data.forEach((dog)=>{
            let row = document.createElement('tr')
            row.id = dog.id
            let name = document.createElement('td')
            name.textContent = dog.name
            name.id = `name`
            let breed = document.createElement('td')
            breed.textContent = dog.breed
            breed.id = 'breed'
            let sex = document.createElement('td')
            sex.textContent = dog.sex
            sex.id = 'sex'
            let btnContainer = document.createElement('td')
            let btn = document.createElement('button')
            btn.textContent = "Edit Dog"
            btn.id = 'editBtn'

            btnContainer.append(btn)
            row.append(name, breed, sex, btnContainer)
            table.append(row)
        })
    }
    getDogs()
    .then(data=>{
        renderDogs(data)
    })

//Make dog editable - when btnis clicked, form at top will populate dogs current info
    function dogEdit(e){
        let row = e.target.parentNode.parentNode
        if(e.target.tagName === 'BUTTON'){
                nameInput.value = row.querySelector('#name').textContent
                nameInput.className = row.id
                breedInput.value = row.querySelector('#breed').textContent
                sexInput.value = row.querySelector('#sex').textContent
        }
        } 
    
    table.addEventListener('click', dogEdit)

  

//On submit of form, a PATCH request should be made to update DB and update DOM
    
    function submit(e){
        e.preventDefault() 

        fetch(`http://localhost:3000/dogs/${nameInput.className}`,{
            method: "PATCH",
            headers: {
                "Content-type":"application/json",
                Accept : "application/json"
            },
            body: JSON.stringify({
                "name": nameInput.value,
                "breed": breedInput.value,
                "sex": sexInput.value
            })

        })
        .then(res=> res.json())
        .then(data => {
            let rowToUpdate = document.getElementById(`${data.id}`)
            rowToUpdate.innerHTML = `<td id="name">${data.name}</td><td id="breed">${data.breed}</td><td id="sex">${data.sex}</td><td><button id="editBtn">Edit Dog</button></td>`
        })
        
        form.reset()
    }
        
    form.addEventListener('submit', submit)

   
})