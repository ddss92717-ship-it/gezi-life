//工具函数
const Utils={
    //闰年判断
    isLeapYear(y){
        return (y%4===0 && y%100!==0) || y%400===0;
    },
    getYearDayCount(y){
        return this.isLeapYear(y)?366:365;
    },
    //权重随机
    weightedRandom(list){
        const total=list.reduce((s,i)=>s+i.weight,0);
        let r=Math.random()*total;
        for(let item of list){
            r-=item.weight;
            if(r<=0) return item;
        }
        return list[list.length-1];
    },
    randInt(min,max){
        return Math.floor(Math.random()*(max-min+1))+min;
    },
    clamp(v,min,max){
        return Math.max(min,Math.min(max,v));
    },
    //公历第N天转月日 1=1月1日
    dayOfYearToMD(dayIdx,isLeap){
        const monthDay=[31,28,31,30,31,30,31,31,30,31,30,31];
        if(isLeap) monthDay[1]=29;
        let m=0;
        while(dayIdx>monthDay[m]){
            dayIdx-=monthDay[m];
            m++;
        }
        return {month:m+1,day:dayIdx};
    }
}
