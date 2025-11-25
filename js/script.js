
var itemTitle =document.querySelector('#itemTitle')
var itemCategory =document.querySelector('#itemCategory')
var itemAmount =document.querySelector('#itemAmount')
var itemDate =document.querySelector('#itemDate')
var itemList = []
 var regex ={
        itemTitle : {
            value: /^[a-zA-Z][a-zA-Z  ]{2,15}$/ ,
            isValid: false 
        },
        itemCategory : {
            value:/^[a-zA-Z][a-zA-Z &]{2,15}$/,
            isValid: false
        },
        itemAmount : {
            value: /^[0-9]+$/ ,
            isValid : false 
        } ,
    }

if(localStorage.getItem("itemList") != null){
    itemList =JSON.parse(localStorage.getItem("itemList"))
   displayItems(itemList)
}

console.log(itemTitle,itemCategory,itemAmount,itemDate)

function setStorage(){
   localStorage.setItem("itemList" ,JSON.stringify(itemList))

}


function addItem(){
    var item ={
        title: itemTitle.value ,
        amount:itemAmount.value ,
        category : itemCategory.value,
        date :itemDate.value
    }
    
    itemList.push(item)
    setStorage() 
    displayItems(itemList )
    clear()
    displatAmount()
    renderCategoryChart();
    console.log(itemList)
}

// function displayItems(){
//     var cartona = `` ;
//     for(var i =0 ;i < itemList.length ; i++){
//         cartona +=` <div class="item-card w-75 mx-auto mt-2 mb-2 ">
//            <h4>${itemList[i].title}</h4>
//            <h5>${itemList[i].category}</h5>
//            <div class="item-card-data">
//              <h6>${itemList[i].amount}</h6>
//              <span>${itemList[i].date}</span>
//            </div>
//         </div>`

//         document.querySelector('#myitems').innerHTML =cartona
//     }
// }

function displayItems(list) {
  document.querySelector('#myitems').innerHTML =
    list
      .map((item ,index)=> 
       ` <div class="item-card w-75 mx-auto mt-2 mb-2">
          <h4>${item.title}</h4>
          <h6 class="category-text">${item.category}</h6>
          <div class="item-card-data">
            <h6>${item.amount}</h6>
            <span>${item.date}</span>
            <span onclick="deleteItem(${index})"> <i class="fa-solid fa-trash"></i></span>
          </div>
        </div> `)
      .join('') ;
}

function clear(){
 itemTitle.value=null
 itemCategory.value=null
 itemAmount.value=null
 itemDate.value=null
 addBtn.disabled  = true 
 

}

function sumTotal(){
    return itemList.reduce((total,item)=>total+=Number(item.amount),0);
}

function displatAmount(){
     const totalAmount = sumTotal();
    document.querySelector("#totalAmount").textContent = "Total: " + totalAmount;
} 

function deleteItem(index){
    itemList.splice(index,1)
    setStorage()
    displayItems(itemList)
    renderCategoryChart();
   
}

function search(searchValue){
    const value = searchValue.toLowerCase();
    const filterdItems = itemList.filter(
        item=> item.category.toLowerCase().includes(value)
    );
     displayItems(filterdItems)
}

function validateItemInput(item){
   

 if(regex[item.id].value.test(item.value)== true){
    item.nextElementSibling.classList.add("d-none")
    item.classList.remove("is-invalid")
    item.classList.add("is-valid")
    regex[item.id].isValid =true

 }else{
      item.nextElementSibling.classList.remove("d-none")
      item.classList.remove("is-valid")
      item.classList.add("is-invalid")
      regex[item.id].isValid =false

 }
  toggleAddBtn()
}

function toggleAddBtn(){
    if(regex.itemTitle.isValid && regex.itemCategory.isValid && regex.itemAmount.isValid){
        addBtn.disabled  = false 
    }else{
        addBtn.disabled  = true 

    }
}
























function getCategoryData() {
    const data = {};

    itemList.forEach(item => {
        const category = item.category;
        const amount = Number(item.amount);
        if (data[category]) {
            data[category] += amount;
        } else {
            data[category] = amount;
        }
    });

    // convert to arrays for Chart.js
    const labels = Object.keys(data);
    const amounts = Object.values(data);

    return { labels, amounts };
}

let categoryChart; 

function renderCategoryChart() {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    const { labels, amounts } = getCategoryData();

    const colors = [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40'
    ];

    if (categoryChart) {
        categoryChart.data.labels = labels;
        categoryChart.data.datasets[0].data = amounts;
        categoryChart.update();
    } else {
        categoryChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: amounts,
                    backgroundColor: colors,
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const value = context.parsed;
                                const percent = ((value / total) * 100).toFixed(2) + '%';
                                return `${context.label}: ${value} (${percent})`;
                            }
                        }
                    }
                }
            }
        });
    }
}
