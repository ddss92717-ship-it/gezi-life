//V1.0内置事件库
const EVENT_POOL=[
    {
        eventId:"baby_jaundice",
        ageRange:[0,1],
        title:"新生儿生理性黄疸",
        desc:"宝宝测出黄疸数值偏高，医生建议照蓝光住院。",
        options:[
            {text:"住院蓝光治疗",condition:"true",effect:{cash:-2000,hp:5},moodTag:"normal"},
            {text:"回家多晒太阳保守观察",condition:"true",effect:{hp:-15,san:-8},moodTag:"sad"}
        ]
    },
    {
        eventId:"kindergarten_bully",
        ageRange:[3,6],
        title:"幼儿园遭遇霸凌",
        desc:"在幼儿园被其他小朋友欺负，你会怎么做？",
        options:[
            {text:"隐忍，不告诉老师家长",condition:"true",effect:{san:-10,hp:-5,fam:-5},moodTag:"sad"},
            {text:"告诉老师和父母求助",condition:"true",effect:{san:+8,pts:+5},moodTag:"normal"}
        ]
    },
    {
        eventId:"weekend_tutoring",
        ageRange:[7,12],
        title:"周末奥数英语培优班",
        desc:"父母希望你报周末课外补习班提升成绩。",
        options:[
            {text:"报名参加补习班",condition:"true",effect:{cash:-8000,int:+15,san:-20,pts:+8},moodTag:"normal"},
            {text:"拒绝，想要自由玩耍童年",condition:"true",effect:{san:+20,int:-8},moodTag:"happy"}
        ]
    },
    {
        eventId:"highSchoolExam",
        ageRange:[14,17],
        title:"中考普职分流",
        desc:"中考成绩出来，距离普高线有差距。",
        options:[
            {text:"花钱上民办高中",condition:"gameState.cash >=80000",effect:{cash:-80000,int:+12,san:-15},moodTag:"normal"},
            {text:"就读中专技校",condition:"true",effect:{pts:-20,int:-5},moodTag:"sad"}
        ]
    },
    {
        eventId:"996_work",
        ageRange:[22,34],
        title:"大厂996无偿加班",
        desc:"主管通知部门全员需要无偿加班冲刺项目。",
        options:[
            {text:"内卷到底全力加班",condition:"true",effect:{cash:0.2,hp:-15,san:-12,pts:+10},moodTag:"normal"},
            {text:"坚持准时下班",condition:"true",effect:{hp:+5,san:+8,pts:-10},moodTag:"happy"}
        ]
    },
    {
        eventId:"layoff_35",
        ageRange:[33,38],
        title:"35岁裁员优化",
        desc:"公司开启人员优化，HR约谈给到N+1赔偿。",
        options:[
            {text:"拿赔偿，准备考公休整",condition:"true",effect:{cash:1.0,san:-15,pts:-8},moodTag:"sad"},
            {text:"立刻降薪跳槽保住现金流",condition:"true",effect:{cash:-0.3,hp:-8},moodTag:"normal"}
        ]
    },
    {
        eventId:"parent_serious_ill",
        ageRange:[36,45],
        title:"父母突发重大疾病",
        desc:"父母突发重病，医院告知需要大额自费医疗费用。",
        options:[
            {text:"倾尽积蓄全力治疗",condition:"true",effect:{cash:-0.4,hp:-10,san:-20,fam:+15},moodTag:"sad"},
            {text:"选择保守安宁疗护",condition:"true",effect:{fam:-30,san:-30},moodTag:"sad"}
        ]
    }
];

//根据年龄获取候选事件
export function getCandidateEvents(age){
    return EVENT_POOL.filter(e=> age>=e.ageRange[0] && age<=e.ageRange[1]);
}

//解析条件字符串
export function checkOptionCondition(condStr,gameState){
    if(condStr==="true") return true;
    try{
        return new Function("gameState",`return ${condStr}`)(gameState);
    }catch(e){
        return false;
    }
}
