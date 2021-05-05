import helper from './module/helper.js'
const{checkEventPathForClass,p2e,jalali_to_gregorian,calculateMonthsDays,numberPastOfWeek,numberLastOverOfWeek,isLeapYear} = helper



class PersianDatePicker extends HTMLElement {
    date_picker_element = null;
    selected_date_element=null;
    dates_elemnt = null;
    mth_element = null;
    next_mth_element = null;
    prev_mth_element = null;
    days_element = null;
    constructor(){
        super()
        this.shadow = this.attachShadow({ mode: 'open' });
        this.render()
        this.setAttribute('value',new Date().toLocaleDateString('fa-IR'))
    }
    attributeChangedCallback (){
        this.setAttribute('value',new Date().toLocaleDateString('fa-IR'))
    }
    connectedCallback() {
        this.date_picker_element = this.shadow.querySelector('.date-picker');
        this.selected_date_element = document.querySelector('persian-date-picker').shadowRoot.querySelector('.selected-date');
        this.dates_elemnt = this.shadow.querySelector('.date-picker .dates')
        this.mth_element = document.querySelector('persian-date-picker').shadowRoot.querySelector('.date-picker .month .mth')
        this.next_mth_element = document.querySelector('persian-date-picker').shadowRoot.querySelector('.date-picker .month .prev-mth')
        this.prev_mth_element = document.querySelector('persian-date-picker').shadowRoot.querySelector('.date-picker .month .next-mth')
        this.days_element = document.querySelector('persian-date-picker').shadowRoot.querySelector('.date-picker .days')
        
        this.months = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند']
        this.date = new Date().toLocaleDateString('fa-IR')
        this.day = p2e(new Date().toLocaleDateString('fa-IR',{ day: '2-digit' }))
        this.month = p2e( new Date().toLocaleDateString('fa-IR',{month: 'long' }))
        this.weekday = p2e( new Date().toLocaleDateString('fa-IR',{weekday: 'long' }))
        this.monthNumber = p2e(new Date().toLocaleDateString('fa-IR',{month: 'numeric' }))
        this.year = p2e(new Date().toLocaleDateString('fa-IR',{ year: 'numeric' }))

    
        this.date_picker_element.addEventListener('click',(e)=>this.toggleDatePicker(e))
        this.next_mth_element.addEventListener('click',(e)=>this.goToNextMonth(e))
        this.prev_mth_element.addEventListener('click',(e)=>this.goToPrevMonth(e))


        this.selectedDate = this.date;
        this.selectedDay = p2e(this.day);
        this.selectedMonth = this.month;
        this.selectedMonthNumber = p2e(this.monthNumber);
        this.selectedYear = p2e(this.year)
        this.selected_date_element.innerText = this.date 
        
        this.mth_element.innerText =`${this.year} ${this.month} ` 

        this.populateDates()
       
    }

     toggleDatePicker(e){  
        if(!checkEventPathForClass(e.path,'dates')){
            this.dates_elemnt.classList.toggle('active')
        }      
    }
     goToNextMonth(e){
        
        if(this.monthNumber>11){
            this.monthNumber=0;
            this.year++;
        }
    
        this.mth_element.innerText =`${this.year} ${this.months[this.monthNumber]} ` 
        this.monthNumber++
        this.populateDates()
    }

     goToPrevMonth(e){
        
        this.monthNumber--
        
        if(this.monthNumber<=0){
            this.monthNumber=12;
            this.year--;
        }

        this.mth_element.innerText =`${this.year} ${this.months[this.monthNumber-1]} ` 
        this.populateDates()
        
    }

    

    populateDates(){
      
        this.days_element.innerHTML =''
        let amount_days = 31;
        amount_days = calculateMonthsDays(this.monthNumber,this.year)  
        let numberDaysOfMonth = calculateMonthsDays(this.monthNumber,this.year)

        const firstDate = new Date(jalali_to_gregorian(Number(this.year),Number(this.monthNumber),Number(1)));
        const firstWeekDay = firstDate.toLocaleDateString('fa-IR',{weekday:'long'})
        const pastDays = numberPastOfWeek(firstWeekDay)
        let counterPast =(numberDaysOfMonth -pastDays)
        if(isLeapYear(this.year -1)&&this.monthNumber==12 ||this.monthNumber==7)
        counterPast+=1;
        if(isLeapYear(this.year -1)&&this.monthNumber==1 )
        counterPast-=1;
        if(!isLeapYear(this.year -1)&&this.monthNumber==1)
        counterPast-=2;
        for(let i=0;i<pastDays;i++){
            counterPast++;
            const day_element = document.createElement('div')
            day_element.classList.add('day')
            day_element.textContent = counterPast;
            day_element.classList.add('disabled')
            
            this.days_element.appendChild(day_element)
            
        }



        for(let i=0;i<amount_days;i++){
            const day_element = document.createElement('div')
            day_element.classList.add('day')
            day_element.textContent = i+1
            
            if(this.selectedDay==(i+1) && this.selectedMonthNumber==this.monthNumber && this.selectedYear==this.year)
            {
                day_element.classList.add('selected')
            }

            day_element.addEventListener('click',(e)=>{
                
           
                
                this.selectedDate = new Date(jalali_to_gregorian(Number(this.year),Number(this.monthNumber),Number(i+1))).toLocaleDateString('fa-IR')
                this.selectedDay = (i+1);
                this.selectedMonthNumber = this.monthNumber
                this.selectedYear = this.year;
                this.selected_date_element.innerText = this.selectedDate;
                this.setAttribute('value',this.selectedDate)
                this.selected_date_element.dataset.value = this.selectedDate;
                
                this.populateDates()
            })
            this.days_element.appendChild(day_element)
        }

        const lastDate = new Date(jalali_to_gregorian(Number(this.year),Number(this.monthNumber),Number(numberDaysOfMonth)));
        const lastWeekDay = lastDate.toLocaleDateString('fa-IR',{weekday:'long'})
        const lastOverDays = numberLastOverOfWeek(lastWeekDay)
    
    
        for(let i=0;i<lastOverDays;i++){
            const day_element = document.createElement('div')
            day_element.classList.add('day')
            day_element.textContent = i+1;
            day_element.classList.add('disabled')
            this.days_element.appendChild(day_element)
        
        }
    }

    static get observedAttributes() { 
        return ['value']; 
      }
      attributeChangedCallback(name, oldValue, newValue) {
        
      }
    

      get style() {
        return`
        
        h1 {
            margin: 30px 0px;
            color: #313131;
            font-size: 42px;
            font-weight: 900;
            text-align: center;
        }
        
        h1 span {
            font-weight: 300;
        }
        
        .date-picker {
            position: relative;
            width: 100%;
            min-width: 560px;
            height: 60px;
            background-color: #FFF;
            margin: 30px auto;
            box-shadow: 0px 3px 10px rgb(0 0 0 / 20%);
            cursor: pointer;
            user-select: none;
            justify-content: center;
            align-items: center;
            display: flex;
            padding: 0 40px;
        }
        
        .date-picker:hover {
            background-color: #F3F3F3;
        }
        
        .selected-date {
            width: 100%;
            height: 100%;
        
            display: flex;
            justify-content: center;
            align-items: center;
        
            color: #313131;
            font-size: 28px;
        }
        
        .dates {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
        
            background-color: #FFF;
        }
        
        .dates.active {
            display: block;
        }
        
        .month {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #EEE;
            
        }
        
        .arrows {
            width: 35px;
            height: 35px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #313131;
            font-size: 20px;
        }
        
        .arrows:hover {
            background-color: #F3F3F3;
        }
        
        .arrows:active {
            background-color: #00CA85;
        }
        
        .days {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            height: 200px;
        }
        .day { 
            display: flex;
            justify-content: center;
            align-items: center;
            color: #313131;
            font-family: IRANSans;
            font-weight: bold;
        }
        .day.selected {
            background-color: #00CA85;
        }
        .day.disabled {
        color: #c4c4c4;
        opacity: 0.8;
        }
        .name-days-week{
            display: grid;
            grid-template-columns: repeat(7, 1fr);
        }
        .name-days-week span{
            display: flex;
            justify-content: center;
            align-items: center;
            align-self: center;
            padding: 9px;
        }
        
        @media only screen and (max-width: 600px) {
            .name-days-week span{
                font-size: 12px;
                padding: 2px;
            }
        }
        `
      }

      render(){
        this.shadow.innerHTML = `
        <style>${this.style}</style>
         <div class="date-picker">
        <div class="selected-date">
          
        </div>

        <div class="dates">
            <div class="month">
                 <div class="arrows next-mth">&lt;</div>
                 <div class="mth">Julay 2021</div>
                 <div class="arrows prev-mth">&gt;</div>
            </div>
            <div class="name-days-week">
                <span>شنبه</span>
                <span>یکشنبه</span>
                <span>دوشنبه</span>
                <span>سه شنبه</span>
                <span>چهار شنبه</span>
                <span>پنج شنبه</span>
                <span>جمعه</span>
            </div>
            <div class="days">

            </div>
        </div>
    </div>
      `
      }
    }
   

    
    
    


    
    
    window.addEventListener('DOMContentLoaded', () => {

customElements.define('persian-date-picker', PersianDatePicker);
    })