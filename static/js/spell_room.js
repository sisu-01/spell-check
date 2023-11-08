const 소환사_주문 = {
    '정화'      : 210,
    '탈진'      : 210,
    '점멸'      : 300,
    '유체화'    : 210,
    '회복'      : 240,
    '강타'      : 90,
    '순간이동'  : 240,
    '점화'      : 180,
    '방어막'    : 180,
}
//console.log(소환사_주문);
//console.log(React);
//console.log(ReactDOM);

//App
function App() {
    const [socketConnected, setSocketConnected] = React.useState(false);
    const [getSelectedChampion,setSelectedChampion] = React.useState(
        [1,0]
    );
    const [getLaneInfo,setLaneInfo] = React.useState({
        '1': ['null','null',false,false,'탑'],
        '2': ['null','null',false,false,'정글'],
        '3': ['null','null',false,false,'미드'],
        '4': ['null','null',false,false,'원딜'],
        '5': ['null','null',false,false,'서폿'],
    });
    const [getSecond,setSecond] = React.useState({
        '1': [0,0],
        '2': [0,0],
        '3': [0,0],
        '4': [0,0],
        '5': [0,0],
    });

    const webSocketUrl = 'ws://'+window.location.host+'/ws/spell/'+room_id+'/';
    let ws = React.useRef(null);
    
    React.useEffect(() => {
        if (!ws.current) {
            ws.current = new WebSocket(webSocketUrl);
            ws.current.onopen = (e) => {
                setSocketConnected(true);
            }
            ws.current.onmessage = (e) => {
                const data = JSON.parse(e.data);
                const command = data.command;
                const context = data.context;

                if(command === "init") {
                    setLaneInfo(context);
                }
                if(command === "selectSpell") {
                    setLaneInfo(context);
                }
                if(command === "checkboxHandler") {
                    setLaneInfo(context);
                }
                if(command === "selectTime") {
                    let copy = {...getSecond};
                    copy[context.lane][context.lane_idx] = context.second;
                    setSecond(copy);
                }
                if(command === "test") {
                    console.log(command);
                    console.log(context);
                }
            }
            ws.current.onclose = (e) => {
                setSocketConnected(false);
                //alert("연결 끊김! 관리자에게 문의하세요.");
                console.error('Rps socket closed unexpectedly');
                console.log(e);
            }
            ws.current.onerror = (error) => {
                console.log("connection error " + webSocketUrl);
                console.log(error);
            };
        }
    
        return () => {
            console.log("clean up");
            ws.current.close();
        };
    }, []);

    function selectSpell(spell) {
        if(!getLaneInfo[getSelectedChampion[0]]) {
            alert('어떤 공격로의 소환사 주문을 바꿀지 선택하셈;;');
            return false;
        }
        ws.current.send(JSON.stringify({
            command : 'selectSpell',
            context : {
                spell: spell,
                lane: String(getSelectedChampion[0]),
                lane_idx: parseInt(getSelectedChampion[1]),
            },
        }));
        if(getSelectedChampion[1] === 0) {
            getSelectedChampion[1] = 1;
            setSelectedChampion([...getSelectedChampion]);
        }else if(getSelectedChampion[1] === 1) {
            getSelectedChampion[1] = 0;
            getSelectedChampion[0] = getSelectedChampion[0] + 1;
            setSelectedChampion([...getSelectedChampion]);
        }
    }

    const [getToggle,setToggle] = React.useState(true);
    function toggleHandler() {
        setToggle(b => !b);
    }

    return (
        <div className="App">
        {socketConnected?
            <div>
                <div className="header">
                    웹소켓/django 체크
                    <button type="button" onClick={
                        e => toggleHandler()
                    }>{getToggle? '닫기' : '열기'}</button>
                    <UrlCopy />
                </div>
                <div className="champion_list">
                    <Champion laneCnt="1" ws={ws} getSecond={getSecond} setSecond={setSecond} getLaneInfo={getLaneInfo} setLaneInfo={setLaneInfo} getSelectedChampion={getSelectedChampion} setSelectedChampion={setSelectedChampion}/>
                    <Champion laneCnt="2" ws={ws} getSecond={getSecond} setSecond={setSecond} getLaneInfo={getLaneInfo} setLaneInfo={setLaneInfo} getSelectedChampion={getSelectedChampion} setSelectedChampion={setSelectedChampion}/>
                    <Champion laneCnt="3" ws={ws} getSecond={getSecond} setSecond={setSecond} getLaneInfo={getLaneInfo} setLaneInfo={setLaneInfo} getSelectedChampion={getSelectedChampion} setSelectedChampion={setSelectedChampion}/>
                    <Champion laneCnt="4" ws={ws} getSecond={getSecond} setSecond={setSecond} getLaneInfo={getLaneInfo} setLaneInfo={setLaneInfo} getSelectedChampion={getSelectedChampion} setSelectedChampion={setSelectedChampion}/>
                    <Champion laneCnt="5" ws={ws} getSecond={getSecond} setSecond={setSecond} getLaneInfo={getLaneInfo} setLaneInfo={setLaneInfo} getSelectedChampion={getSelectedChampion} setSelectedChampion={setSelectedChampion}/>
                </div>
                {getToggle?
                    <SpellList selectSpell={selectSpell} /> : ''
                }
            </div>
        :
            <div>
                서버 응답 대기중입니다.
            </div>
        }
        </div>
    );
}

//url복사
function UrlCopy() {
    function copy() {
        var obShareUrl = document.getElementById("ShareUrl");
        obShareUrl.className = "test";
        obShareUrl.value = url  // 현재 URL 을 세팅해 줍니다.
        obShareUrl.select();  // 해당 값이 선택되도록 select() 합니다
        document.execCommand("copy"); // 클립보드에 복사합니다.
        obShareUrl.blur(); // 선된것을 다시 선택안된것으로 바꿈니다.
        obShareUrl.className = "d-none";
        alert("링크 복사 완료!"); 
    }
    return (
        <div className="UrlCopy float-right">
            <input type="text" id="ShareUrl" className="d-none" />
            <button onClick={e => copy()}>Url복사</button>
        </div>
    );
}

//챔피언
function Champion(props) {
    return (
        <div id={props.getLaneInfo[props.laneCnt][4]} className="Champion">
            <div className={"lane_name ln-"+props.getLaneInfo[props.laneCnt][4]}></div>
            <div className="haste_container">
                <Haste index="우주" ws={props.ws} laneCnt={props.laneCnt} laneInfoIndex="2" getLaneInfo={props.getLaneInfo} setLaneInfo={props.setLaneInfo} />
                <Haste index="장화" ws={props.ws} laneCnt={props.laneCnt} laneInfoIndex="3" getLaneInfo={props.getLaneInfo} setLaneInfo={props.setLaneInfo} />
            </div>
            <div className="spell_container">
                <Spell ws={props.ws} getSecond={props.getSecond} setSecond={props.setSecond} laneCnt={props.laneCnt} laneInfoIndex="0" getLaneInfo={props.getLaneInfo} getSelectedChampion={props.getSelectedChampion} setSelectedChampion={props.setSelectedChampion}/>
                <Spell ws={props.ws} getSecond={props.getSecond} setSecond={props.setSecond} laneCnt={props.laneCnt} laneInfoIndex="1" getLaneInfo={props.getLaneInfo} getSelectedChampion={props.getSelectedChampion} setSelectedChampion={props.setSelectedChampion}/>
            </div>
        </div>
    );
}

//우주적 통찰력 && 명석함의 아이오니아 장화
function Haste(props) {
    function checkboxHandler(checked) {
        props.ws.current.send(JSON.stringify({
            command : 'checkboxHandler',
            context : {
                checked: checked,
                lane: String(props.laneCnt),
                lane_idx: parseInt(props.laneInfoIndex),
            },
        }));
    }
    return (
        <div className="HasteCheckBox">
            <input type="checkbox" id={"ht_"+props.laneCnt+props.laneInfoIndex}
                checked={props.getLaneInfo[props.laneCnt][props.laneInfoIndex]}
                onChange={e => checkboxHandler(e.target.checked)}/>
            <label htmlFor={"ht_"+props.laneCnt+props.laneInfoIndex}>
                <div className={"haste-label ht-"+props.index}></div>
            </label>
        </div>
    );
}

//소환사 주문
function Spell(props) {

    const startTime = React.useRef(null);
    const [getHover,setHover] = React.useState(false);
    const [getRun,setRun] = React.useState(false);
    const [getRemainTime, setRemainTime] = React.useState(0);
    const [getCount,setCount] = React.useState(0);
    const [getAlarm,setAlarm] = React.useState(false);
    const [get60Alarm,set60Alarm] = React.useState(false);
    const [get20Alarm,set20Alarm] = React.useState(false);

    const selected = String(props.getSelectedChampion[0])+String(props.getSelectedChampion[1]) === props.laneCnt+props.laneInfoIndex? true : false;
    const 라인 = props.getLaneInfo[props.laneCnt][4]+' ';
    const 스펠 = props.getLaneInfo[props.laneCnt][props.laneInfoIndex]+' ';

    const speech = new SpeechSynthesisUtterance();
    speech.lang = 'ko-KR';
    speech.pitch = 1;
    speech.rate = 1;
    //voice
    speech.volume = 1;

    function hoverHandler(hover) {
        props.getLaneInfo[props.laneCnt][props.laneInfoIndex] != 'null' && getRemainTime === 0 ? setHover(hover) : setHover(false);
    }
    function selectTime(second) {
        props.ws.current.send(JSON.stringify({
            command : 'selectTime',
            context : {
                second: second['i'],
                lane: String(props.laneCnt),
                lane_idx: parseInt(props.laneInfoIndex),
            },
        }));
    }

    function calcRemainTime() {
        const cooltime = 소환사_주문[props.getLaneInfo[props.laneCnt][props.laneInfoIndex]];
        let haste = 0;
        props.getLaneInfo[props.laneCnt][2] ? haste += 18 : false;//우통
        props.getLaneInfo[props.laneCnt][3] ? haste += 12 : false;//쿨감식
        return Math.floor(cooltime-haste/(100+haste)*cooltime)-props.getSecond[props.laneCnt][props.laneInfoIndex];
    }
    function getSecond(time) {
        let second = Number(time % 60);
        if(second < 10) {
            return "0"+String(second);
        } else {
            return String(second);
        }
    }
    function parse(num) {
        return parseInt(num/1000);
    }
    function tts(text){
        speech.text = text;
        window.speechSynthesis.speak(speech);
    }

    //시작이다
    if(props.getSecond[props.laneCnt][props.laneInfoIndex] > 0 && getRemainTime === 0 && !getRun) {
        startTime.current = Date.now();
        setRun(true);
        setRemainTime(calcRemainTime());
    }

    React.useEffect(()=>{
        if(getRun && getRemainTime > 0){
            setTimeout(() => {
                setCount(Date.now() - startTime.current);
                if(!getAlarm) {
                    console.log('온');
                    tts(라인+스펠);
                    setAlarm(true);
                }
                if(getRemainTime-parse(getCount)<=60 && !get60Alarm) {
                    console.log('1분');
                    tts(라인+스펠+'1분');
                    set60Alarm(true);
                }
                if(getRemainTime-parse(getCount)<=20 && !get20Alarm) {
                    console.log('20초');
                    tts(라인+스펠+'20초');
                    set20Alarm(true);
                }
                if(getRemainTime-parse(getCount)<=0 || parse(getCount) >= getRemainTime) {
                    console.log('끝!');
                    tts(라인+스펠+'온');
                    setHover(false);
                    setRun(false);
                    setRemainTime(0);
                    setCount(0);
                    setAlarm(false);
                    set60Alarm(false);
                    set20Alarm(false);
                    let copy = {...props.getSecond};
                    copy[props.laneCnt][props.laneInfoIndex] = 0;
                    props.setSecond(copy);
                }
            }, 10);
        }
    },[getRemainTime, getCount]);
    
    return (
        <div className={selected? 'Spell focus' : 'Spell normal'}>
            <div className={"spell sp-"+props.getLaneInfo[props.laneCnt][props.laneInfoIndex]}
                onClick={e => {props.setSelectedChampion([Number(props.laneCnt),Number(props.laneInfoIndex)])}}
                onMouseEnter={e => hoverHandler(true)}
                onMouseLeave={e => hoverHandler(false)}>
                {getHover && props.getLaneInfo[props.laneCnt][props.laneInfoIndex] != 'null' && getRemainTime === 0 ?
                    <TimeSelector selectTime={selectTime} /> : ''
                }
            </div>
            <div className={props.getLaneInfo[props.laneCnt][props.laneInfoIndex] != 'null' && getRemainTime != 0 ? 'black' : 'd-none'}>
            </div>
            <div className={props.getLaneInfo[props.laneCnt][props.laneInfoIndex] != 'null' && getRemainTime != 0 ? 'spell-count' : 'd-none'}>
                {parseInt((getRemainTime-parse(getCount))/60)}:{getSecond(getRemainTime-parse(getCount))}
                <br />
                {getRemainTime-parse(getCount)}
            </div>
        </div>
    );
}

//시간 선택
function TimeSelector(props) {
    function Buttons() {
        let arr = [];
        for(let i=10; i<=60; i=i+10){
            arr.push(
                <button key={i} type="button"
                    onClick={e=>props.selectTime({i})}>{i}초 전</button>
            );
        }
        return (arr);
    }
    return (
        <div className="TimeSelector">
            <Buttons />
        </div>
    );
}

//소환사 주문 목록
function SpellList(props) {
    function jsonLoop() {
        const newArr = [];
        for (let key in 소환사_주문) {
            newArr.push(
                <div key={key}
                    id={key}
                    className={"spell sp-"+key}
                    onClick={e => {props.selectSpell(key)}}>
                </div>
            );
        }
        return newArr;
    }
    return (
        <div className="spell_list">
            {jsonLoop()}
        </div>
    )
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <App />
);