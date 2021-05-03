import helper from './module/helper.js'
const{checkEventPathForClass,p2e,jalali_to_gregorian,calculateMonthsDays,numberPastOfWeek,numberLastOverOfWeek,isLeapYear} = helper
//selectors
const date_picker_element = document.querySelector('.date-picker');
const selected_date_element = document.querySelector('.selected-date');
const dates_elemnt = document.querySelector('.date-picker .dates')
const mth_element = document.querySelector('.date-picker .month .mth')
const next_mth_element = document.querySelector('.date-picker .month .prev-mth')
const prev_mth_element = document.querySelector('.date-picker .month .next-mth')
const days_element = document.querySelector('.date-picker .days')




const months = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند']
const date = new Date().toLocaleDateString('fa-IR')
const  day = p2e(new Date().toLocaleDateString('fa-IR',{ day: '2-digit' }))
const month = p2e( new Date().toLocaleDateString('fa-IR',{month: 'long' }))
const weekday = p2e( new Date().toLocaleDateString('fa-IR',{weekday: 'long' }))
let monthNumber = p2e(new Date().toLocaleDateString('fa-IR',{month: 'numeric' }))
let  year = p2e(new Date().toLocaleDateString('fa-IR',{ year: 'numeric' }))


let selectedDate = date;
let selectedDay = p2e(day);
let selectedMonth = month;
let selectedMonthNumber = p2e(monthNumber);
let selectedYear = p2e(year)
selected_date_element.innerText = date 
mth_element.innerText =`${year} ${month} ` 
populateDates()

//event listener
date_picker_element.addEventListener('click',toggleDatePicker)
next_mth_element.addEventListener('click',goToNextMonth)
prev_mth_element.addEventListener('click',goToPrevMonth)

//functions

function toggleDatePicker(e){
    
    if(!checkEventPathForClass(e.path,'dates')){
        dates_elemnt.classList.toggle('active')
    }  
}

function goToNextMonth(e){
    
    if(monthNumber>11){
        monthNumber=0;
        year++;
    }
   
    mth_element.innerText =`${year} ${months[monthNumber]} ` 
    monthNumber++
    populateDates()
}
function goToPrevMonth(e){
    monthNumber--
    
    if(monthNumber<=0){
        monthNumber=12;
        year--;
    }

    mth_element.innerText =`${year} ${months[monthNumber-1]} ` 
    populateDates()
    
}

function populateDates(e){
    days_element.innerHTML =''

    let amount_days = 31;
    amount_days = calculateMonthsDays(monthNumber,year)

  
     
    let numberDaysOfMonth = calculateMonthsDays(monthNumber,year)
    


    const firstDate = new Date(jalali_to_gregorian(Number(year),Number(monthNumber),Number(1)));
    const firstWeekDay = firstDate.toLocaleDateString('fa-IR',{weekday:'long'})
    const pastDays = numberPastOfWeek(firstWeekDay)
    let counterPast =(numberDaysOfMonth -pastDays)
    if(isLeapYear(year -1)&&monthNumber==12 ||monthNumber==7)
    counterPast+=1;
    if(isLeapYear(year -1)&&monthNumber==1 )
    counterPast-=1;
    if(!isLeapYear(year -1)&&monthNumber==1)
    counterPast-=2;
    for(let i=0;i<pastDays;i++){
        counterPast++;
        const day_element = document.createElement('div')
        day_element.classList.add('day')
        day_element.textContent = counterPast;
        day_element.classList.add('disabled')
        days_element.appendChild(day_element)
        
    }



    for(let i=0;i<amount_days;i++){
        const day_element = document.createElement('div')
        day_element.classList.add('day')
        day_element.textContent = i+1
        
        if(selectedDay==(i+1) && selectedMonthNumber==monthNumber && selectedYear==year)
        {
            day_element.classList.add('selected')
        }

        day_element.addEventListener('click',function(e){
            
            
            selectedDate = new Date(jalali_to_gregorian(Number(year),Number(monthNumber),Number(i+1))).toLocaleDateString('fa-IR')
            selectedDay = (i+1);
            selectedMonthNumber = monthNumber
            selectedYear = year;
            selected_date_element.innerText = selectedDate;
            selected_date_element.dataset.value = selectedDate;
            populateDates()
        })
        days_element.appendChild(day_element)
    }

    const lastDate = new Date(jalali_to_gregorian(Number(year),Number(monthNumber),Number(numberDaysOfMonth)));
    const lastWeekDay = lastDate.toLocaleDateString('fa-IR',{weekday:'long'})
    const lastOverDays = numberLastOverOfWeek(lastWeekDay)
  
  
    for(let i=0;i<lastOverDays;i++){
        const day_element = document.createElement('div')
        day_element.classList.add('day')
        day_element.textContent = i+1;
        day_element.classList.add('disabled')
        days_element.appendChild(day_element)
       
    }
}


