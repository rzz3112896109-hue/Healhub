import { useEffect, useMemo, useRef, useState } from "react";
import { HashRouter, NavLink, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import {
  House, Smiley, ChatCircleDots, UsersThree, CalendarDots, UserCircle,
  Bell, Leaf, ArrowRight, LockKey, TrendUp, PencilSimple, Heart,
  ChatCircle, PaperPlaneTilt, Play, Pause, Wind, Sparkle, Check,
  MapPin, Clock, Medal, FileText, List, X, Quotes, CaretLeft,
  CaretRight, Plus, MoonStars, Headphones, SignOut, Fire,
} from "@phosphor-icons/react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from "recharts";

const moods = [
  { id: "joy", label: "愉悦", face: "◡", color: "#72ad94", score: 5 },
  { id: "calm", label: "平静", face: "—", color: "#8eb8b2", score: 4 },
  { id: "okay", label: "一般", face: "·", color: "#e1b96f", score: 3 },
  { id: "low", label: "低落", face: "⌒", color: "#91afd1", score: 2 },
  { id: "anxious", label: "焦虑", face: "~", color: "#a99bc9", score: 1 },
];

const initialPosts = [
  { id: 1, name: "安心的树洞", time: "18分钟前", tag: "日常心绪", content: "最近有点疲惫，但今天允许自己慢一点。下楼走了十分钟，风很轻，感觉心里也松了一点。", likes: 86, comments: ["谢谢你提醒我，慢一点也没关系。"] },
  { id: 2, name: "一阵晚风", time: "2小时前", tag: "互助问答", content: "换了新的工作环境，有一点不安。大家在面对陌生感时，会怎样照顾自己？", likes: 42, comments: ["我会先熟悉一条回家的路。", "给自己一周适应，不急着表现完美。"] },
  { id: 3, name: "云朵收藏家", time: "昨天", tag: "微小确幸", content: "今天看见了日落，突然觉得生活很美好。把这份暖意也送给正在读这段话的你。", likes: 128, comments: [] },
];

const activities = [
  { id: 1, title: "正念呼吸体验工作坊", category: "身心练习", date: "6月28日 周日", time: "14:00–15:30", place: "和悦社区 · 3栋静心室", host: "林青 · 正念引导师", joined: 12, capacity: 20, tone: "sage" },
  { id: 2, title: "园艺疗愈小组", category: "自然疗愈", date: "7月2日 周四", time: "10:00–11:30", place: "社区花园 · 雨棚区", host: "唐棠 · 园艺师", joined: 8, capacity: 15, tone: "blue" },
  { id: 3, title: "情绪书写小课堂", category: "表达疗愈", date: "7月5日 周日", time: "19:00–20:30", place: "社区活动中心 · 多功能室", host: "周老师 · 心理咨询师", joined: 15, capacity: 30, tone: "lavender" },
  { id: 4, title: "晨光慢走疗愈团", category: "邻里陪伴", date: "7月9日 周四", time: "07:30–08:30", place: "中心公园 · 东门集合", host: "社区志愿者小组", joined: 21, capacity: 25, tone: "peach" },
];

const weekData = [
  { day: "周一", score: 4, energy: 62 }, { day: "周二", score: 3, energy: 54 },
  { day: "周三", score: 4, energy: 70 }, { day: "周四", score: 2, energy: 46 },
  { day: "周五", score: 1, energy: 38 }, { day: "周六", score: 3, energy: 60 },
  { day: "今天", score: 5, energy: 78 },
];

function useLocalStorage(key, fallback) {
  const [value, setValue] = useState(() => {
    try { const saved = localStorage.getItem(key); return saved ? JSON.parse(saved) : fallback; }
    catch { return fallback; }
  });
  useEffect(() => { localStorage.setItem(key, JSON.stringify(value)); }, [key, value]);
  return [value, setValue];
}

function GlassCard({ children, className = "", onClick }) {
  return <section onClick={onClick} className={`glass-card ${className}`}>{children}</section>;
}

function Brand() {
  return <div className="brand-wrap"><div className="brand-mark"><Leaf weight="duotone" /></div><div><div className="brand">HealHub</div><div className="brand-sub">智慧社区疗愈平台</div></div></div>;
}

const navItems = [
  ["/", "首页", House], ["/mood", "情绪空间", Smiley], ["/ai", "AI疗愈室", ChatCircleDots],
  ["/community", "社区疗愈圈", UsersThree], ["/activities", "线下活动", CalendarDots], ["/profile", "个人中心", UserCircle],
];

function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  useEffect(() => setMobileOpen(false), [location.pathname]);
  return <div className="app-shell">
    <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
      <div className="sidebar-top"><Brand /><button className="icon-btn mobile-close" onClick={() => setMobileOpen(false)} aria-label="关闭菜单"><X /></button></div>
      <nav className="side-nav">
        {navItems.map(([to, label, Icon]) => <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}><Icon weight="duotone" /><span>{label}</span></NavLink>)}
      </nav>
      <div className="side-quote"><Leaf weight="thin" /><Quotes weight="fill" /><p>慢下来，<br />感受当下的呼吸，<br />生活会给你答案。</p></div>
      <div className="privacy"><LockKey weight="duotone" /><span><b>隐私守护</b><small>你的感受，只属于你</small></span></div>
    </aside>
    <main className="main-area">
      <header className="topbar">
        <button className="icon-btn menu-btn" onClick={() => setMobileOpen(true)} aria-label="打开菜单"><List /></button>
        <div className="mobile-brand"><Brand /></div>
        <div className="top-actions"><button className="icon-btn notification"><Bell weight="duotone" /><i /></button><div className="avatar">林</div><div className="user-greeting">你好，林语</div></div>
      </header>
      <div className="page-content">{children}</div>
    </main>
    {mobileOpen && <button className="overlay" aria-label="关闭菜单" onClick={() => setMobileOpen(false)} />}
  </div>;
}

function PageIntro({ eyebrow, title, desc, action }) {
  return <div className="page-intro"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{desc}</p></div>{action}</div>;
}

function MoodPicker({ onPick, selected, compact = false }) {
  return <div className={`mood-picker ${compact ? "compact" : ""}`}>{moods.map(m => <button key={m.id} className={`mood-option ${selected === m.id ? "selected" : ""}`} style={{ "--mood": m.color }} onClick={() => onPick(m)}><span className="mood-face">{m.face}</span><span>{m.label}</span></button>)}</div>;
}

function MoodModal({ onClose, onSave }) {
  const [selected, setSelected] = useState("calm");
  const [note, setNote] = useState("");
  return <div className="modal-backdrop" onMouseDown={onClose}><div className="modal-card" onMouseDown={e => e.stopPropagation()}>
    <button className="icon-btn modal-close" onClick={onClose}><X /></button><div className="modal-icon"><Leaf weight="duotone" /></div>
    <h2>此刻，你的心情是怎样的？</h2><p>不用急着解释，先看见自己的感受。</p>
    <MoodPicker selected={selected} onPick={m => setSelected(m.id)} />
    <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="想对今天的自己说些什么……" />
    <button className="primary-btn full" onClick={() => onSave({ mood: selected, note, date: new Date().toISOString() })}>保存此刻 <Check weight="bold" /></button>
  </div></div>;
}

function MoodChart({ data = weekData, height = 220 }) {
  return <div style={{ width: "100%", height }}><ResponsiveContainer><AreaChart data={data} margin={{ top: 10, right: 8, left: -24, bottom: 0 }}><defs><linearGradient id="moodFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4f9990" stopOpacity={0.35}/><stop offset="100%" stopColor="#4f9990" stopOpacity={0.02}/></linearGradient></defs><CartesianGrid vertical={false} stroke="#dce5e1" strokeDasharray="3 4"/><XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "#71807c", fontSize: 12 }}/><YAxis domain={[0, 5]} ticks={[1,2,3,4,5]} tickLine={false} axisLine={false} tick={{ fill: "#9aa9a5", fontSize: 11 }}/><Tooltip contentStyle={{ border: 0, borderRadius: 14, boxShadow: "0 10px 30px rgba(57,87,79,.12)" }} formatter={v => [moods.find(m => m.score === v)?.label || v, "情绪"]}/><Area type="monotone" dataKey="score" stroke="#347f78" strokeWidth={3} fill="url(#moodFill)" dot={{ r: 4, fill: "#fff", stroke: "#347f78", strokeWidth: 3 }} activeDot={{ r: 6 }}/></AreaChart></ResponsiveContainer></div>;
}

function Home({ moodLogs, setMoodLogs }) {
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const saveMood = log => { setMoodLogs([log, ...moodLogs]); setModal(false); };
  return <>
    <PageIntro eyebrow="2026年6月21日 · 周日" title="午安，愿你被温柔以待" desc="照顾好自己的感受，就是照顾好生活的每一天。" action={<button className="primary-btn" onClick={() => setModal(true)}><Leaf weight="duotone" /> 今日情绪</button>} />
    <div className="home-grid">
      <GlassCard className="hero-journal">
        <div className="leaf-shadow" /><div className="hero-copy"><span className="soft-label"><Sparkle /> AI疗愈伙伴</span><h2>需要一点陪伴<br />与支持吗？</h2><p>小禾随时在这里，倾听你的心声。</p><button className="primary-btn" onClick={() => navigate("/ai")}>进入 AI 疗愈室 <ArrowRight /></button><small><LockKey /> 隐私保护中，内容仅对你可见</small></div><div className="plant-visual"><Leaf weight="thin" /><Leaf weight="thin" /><Leaf weight="thin" /></div>
      </GlassCard>
      <GlassCard className="trend-card"><div className="card-heading"><div><span className="eyebrow">本周状态</span><h3>近7天情绪趋势</h3></div><button className="text-btn" onClick={() => navigate("/mood")}>更多 <ArrowRight /></button></div><MoodChart height={230}/><div className="trend-note"><TrendUp /> 比上周更稳定了 12%</div></GlassCard>
      <GlassCard className="journal-card"><div className="card-heading"><div><span className="eyebrow">心绪手帐</span><h3>记录此刻的你</h3></div><PencilSimple weight="duotone" /></div><button className="journal-input" onClick={() => setModal(true)}><span>此刻，你的心情是怎样的？</span><small>写下感受，让情绪被看见……</small><i>开始记录 <ArrowRight /></i></button></GlassCard>
      <GlassCard className="meditation-card"><div className="card-heading"><div><span className="eyebrow">即将开始</span><h3>今晚的冥想</h3></div><MoonStars weight="duotone" /></div><div className="meditation-row"><div className="meditation-art"><Headphones weight="duotone" /></div><div><b>放松身心 · 晚间舒缓冥想</b><p>20 分钟 · 助眠放松</p><small>今天 21:00 开始</small></div></div><button className="secondary-btn full" onClick={() => navigate("/ai")}>预约参加</button></GlassCard>
      <GlassCard className="voices-card"><div className="card-heading"><div><span className="eyebrow">匿名分享</span><h3>社区心声</h3></div><button className="text-btn" onClick={() => navigate("/community")}>更多 <ArrowRight /></button></div><div className="note-row">{initialPosts.slice(0,3).map((p,i) => <button key={p.id} className={`paper-note note-${i}`} onClick={() => navigate("/community")}><p>{p.content.slice(0,42)}…</p><span>— {p.name}</span><small><Heart /> {p.likes} 人感同身受</small></button>)}</div></GlassCard>
      <GlassCard className="events-mini"><div className="card-heading"><div><span className="eyebrow">就在附近</span><h3>线下疗愈活动</h3></div><button className="text-btn" onClick={() => navigate("/activities")}>更多 <ArrowRight /></button></div>{activities.slice(0,3).map(a => <div className="mini-event" key={a.id}><div className={`event-dot ${a.tone}`}><Leaf /></div><div><b>{a.title}</b><small><Clock /> {a.date} · {a.time}</small></div><span>{a.joined}/{a.capacity}</span></div>)}</GlassCard>
    </div>
    {modal && <MoodModal onClose={() => setModal(false)} onSave={saveMood} />}
  </>;
}

function MoodSpace({ moodLogs, setMoodLogs }) {
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState("");
  const [monthOffset, setMonthOffset] = useState(0);
  const now = new Date(); const view = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  const days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const start = view.getDay();
  const save = () => { if (!selected) return; setMoodLogs([{ mood: selected.id, note, date: new Date().toISOString() }, ...moodLogs]); setNote(""); };
  const chartData = weekData.map((d, i) => i === 6 && moodLogs[0] ? { ...d, score: moods.find(m => m.id === moodLogs[0].mood)?.score || d.score } : d);
  return <><PageIntro eyebrow="情绪空间" title="看见情绪，也看见变化" desc="每一次记录都不是评判，而是更靠近自己的小小一步。" />
    <div className="mood-layout">
      <GlassCard className="checkin-panel"><div className="step-tag">今日打卡</div><h2>现在的你，感觉如何？</h2><p>选择最接近此刻的感受</p><MoodPicker selected={selected?.id} onPick={setSelected}/><textarea value={note} onChange={e => setNote(e.target.value)} placeholder="给此刻的心情留一句话……"/><button className="primary-btn full" disabled={!selected} onClick={save}>{selected ? `记录「${selected.label}」` : "先选择一种情绪"} <Check /></button>{moodLogs[0] && <div className="saved-tip"><Check /> 最近一次记录已安全保存在此设备</div>}</GlassCard>
      <GlassCard className="calendar-card"><div className="card-heading"><button className="icon-btn" onClick={() => setMonthOffset(v => v-1)}><CaretLeft /></button><h3>{view.getFullYear()}年 {view.getMonth()+1}月</h3><button className="icon-btn" onClick={() => setMonthOffset(v => v+1)}><CaretRight /></button></div><div className="calendar-week">{["日","一","二","三","四","五","六"].map(d => <span key={d}>{d}</span>)}</div><div className="calendar-grid">{Array(start).fill(0).map((_,i)=><i key={`e${i}`} />)}{Array.from({length:days},(_,i)=>i+1).map(d => { const marked = d % 3 === 0 || d === now.getDate(); const mood = moods[d % moods.length]; return <button key={d} className={d===now.getDate()?"today":""}><span>{d}</span>{marked && <b style={{background:mood.color}}>{mood.face}</b>}</button>})}</div><div className="calendar-legend"><span><i className="marked"/>已记录 12 天</span><span><Fire weight="duotone"/>连续 5 天</span></div></GlassCard>
      <GlassCard className="chart-wide"><div className="card-heading"><div><span className="eyebrow">情绪轨迹</span><h3>本周情绪波动</h3></div><span className="status-pill">整体平稳</span></div><MoodChart data={chartData} height={280}/></GlassCard>
      <GlassCard className="insight-card"><Sparkle weight="duotone"/><span><small>本周小洞察</small><b>你的情绪在周末明显回升</b><p>散步和与朋友交流，似乎能给你带来更多安定感。</p></span></GlassCard>
    </div>
  </>;
}

const aiReplies = ["我在这里听着。愿意多说一点，今天是什么让你感到不容易吗？", "听起来你已经撑了很久。现在不需要马上解决一切，我们可以先一起慢慢呼吸。", "谢谢你把这份感受告诉我。你的反应很真实，也值得被温柔地理解。", "如果把此刻的心情比作一种天气，它更像什么呢？我们可以从那里慢慢开始。"];

function Timer({ minutes, label }) {
  const [seconds, setSeconds] = useState(minutes * 60); const [running, setRunning] = useState(false);
  useEffect(() => { if (!running || seconds <= 0) return; const id = setInterval(() => setSeconds(s => s-1), 1000); return () => clearInterval(id); }, [running, seconds]);
  const pct = (seconds/(minutes*60))*100;
  return <div className="timer"><div className="timer-ring" style={{"--progress":`${pct*3.6}deg`}}><span>{String(Math.floor(seconds/60)).padStart(2,"0")}:{String(seconds%60).padStart(2,"0")}</span><small>{label}</small></div><button className="primary-btn circle" onClick={() => setRunning(!running)}>{running ? <Pause weight="fill"/> : <Play weight="fill"/>}</button><button className="text-btn" onClick={() => {setRunning(false);setSeconds(minutes*60)}}>重新开始</button></div>;
}

function BreathTrainer() {
  const [active, setActive] = useState(false); const [phase, setPhase] = useState("吸气");
  useEffect(() => { if (!active) return; const phases=["吸气","屏息","呼气","停留"]; let i=0; const id=setInterval(()=>{i=(i+1)%4;setPhase(phases[i])},4000); return()=>clearInterval(id)},[active]);
  return <div className="breath-wrap"><div className={`breath-orb ${active ? "active" : ""}`}><Wind weight="thin"/><b>{active ? phase : "准备好了吗"}</b><small>{active ? "跟随圆环，慢慢呼吸" : "4-4-4-4 箱式呼吸"}</small></div><button className="primary-btn" onClick={()=>setActive(!active)}>{active?"结束练习":"开始呼吸练习"}</button></div>;
}

function AIRoom() {
  const [tab, setTab] = useState("chat"); const [input,setInput]=useState(""); const [typing,setTyping]=useState(false);
  const [messages,setMessages]=useState([{role:"ai",text:"你好，我是小禾。这里是一个安全、安静的空间。今天想从哪里开始聊起？"}]);
  const endRef=useRef(null); useEffect(()=>endRef.current?.scrollIntoView({behavior:"smooth"}),[messages,typing]);
  const send=()=>{ if(!input.trim())return; const text=input.trim(); setMessages(m=>[...m,{role:"user",text}]);setInput("");setTyping(true);setTimeout(()=>{setMessages(m=>[...m,{role:"ai",text:aiReplies[m.length%aiReplies.length]}]);setTyping(false)},900)};
  return <><PageIntro eyebrow="AI疗愈室" title="小禾在这里，听你说" desc="无需组织好语言，你可以从任何一个小小的感受开始。" action={<span className="safe-badge"><LockKey /> 对话仅保存在当前会话</span>} />
    <div className="therapy-tabs">{[["chat","倾听对话",ChatCircleDots],["meditate","冥想空间",Headphones],["breath","呼吸训练",Wind]].map(([id,l,I])=><button key={id} onClick={()=>setTab(id)} className={tab===id?"active":""}><I weight="duotone"/>{l}</button>)}</div>
    {tab==="chat"&&<GlassCard className="chat-room"><div className="chat-header"><div className="ai-avatar"><Leaf weight="duotone"/></div><div><b>小禾 · AI疗愈伙伴</b><span><i/> 正在陪伴你</span></div><button className="secondary-btn" onClick={()=>setMessages(messages.slice(0,1))}>开启新对话</button></div><div className="messages">{messages.map((m,i)=><div key={i} className={`message ${m.role}`}><div>{m.text}</div><small>{m.role==="ai"?"小禾":"你"} · 刚刚</small></div>)}{typing&&<div className="typing"><i/><i/><i/></div>}<div ref={endRef}/></div><div className="quick-prompts">{["最近有点疲惫","我睡不着","想做个情绪梳理"].map(p=><button key={p} onClick={()=>setInput(p)}>{p}</button>)}</div><div className="chat-input"><textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send()}}} placeholder="写下你此刻想说的话……"/><button onClick={send} disabled={!input.trim()}><PaperPlaneTilt weight="fill"/></button></div><p className="ai-disclaimer">AI陪伴不能替代专业医疗建议。如有紧急情况，请联系当地专业机构。</p></GlassCard>}
    {tab==="meditate"&&<div className="practice-grid"><GlassCard className="meditation-main"><span className="soft-label"><MoonStars/> 今日推荐</span><h2>回到身体，安住此刻</h2><p>跟随声音，轻轻放下今天积累的疲惫。</p><Timer minutes={10} label="舒缓冥想"/></GlassCard><GlassCard className="session-list"><h3>更多冥想练习</h3>{[["晨间清醒","8分钟"],["焦虑时的安定","12分钟"],["睡前身体扫描","20分钟"]].map(([a,b],i)=><button key={a}><span className={`session-icon s${i}`}><Headphones/></span><span><b>{a}</b><small>{b} · 中文引导</small></span><Play weight="fill"/></button>)}</GlassCard></div>}
    {tab==="breath"&&<GlassCard className="breath-card"><div><span className="soft-label"><Wind/> 4分钟练习</span><h2>让呼吸带你回到当下</h2><p>无需做得完美，只要跟随自己的节奏。</p><ul><li><Check/>吸气 4 秒</li><li><Check/>屏息 4 秒</li><li><Check/>呼气 4 秒</li><li><Check/>停留 4 秒</li></ul></div><BreathTrainer/></GlassCard>}
  </>;
}

function Community({ posts,setPosts }) {
  const [composer,setComposer]=useState(false); const [text,setText]=useState(""); const [filter,setFilter]=useState("全部"); const [commenting,setCommenting]=useState(null); const [comment,setComment]=useState("");
  const publish=()=>{if(!text.trim())return;setPosts([{id:Date.now(),name:"一片安静的叶子",time:"刚刚",tag:"日常心绪",content:text,likes:0,comments:[]},...posts]);setText("");setComposer(false)};
  const like=id=>setPosts(posts.map(p=>p.id===id?{...p,likes:p.likes+1}:p));
  const addComment=id=>{if(!comment.trim())return;setPosts(posts.map(p=>p.id===id?{...p,comments:[...p.comments,comment]}:p));setComment("");setCommenting(null)};
  const shown=filter==="全部"?posts:posts.filter(p=>p.tag===filter);
  return <><PageIntro eyebrow="社区疗愈圈" title="在这里，你不必独自面对" desc="匿名表达、彼此倾听，让每一种感受都有被接住的地方。" action={<button className="primary-btn" onClick={()=>setComposer(true)}><Plus weight="bold"/> 匿名发布</button>}/>
    <div className="community-layout"><div><div className="filter-bar">{["全部","日常心绪","互助问答","微小确幸"].map(f=><button key={f} className={filter===f?"active":""} onClick={()=>setFilter(f)}>{f}</button>)}</div><div className="post-list">{shown.map(p=><GlassCard className="post-card" key={p.id}><div className="post-head"><div className="anon-avatar"><Leaf weight="duotone"/></div><div><b>{p.name}</b><small>{p.time} · 匿名发布</small></div><span>{p.tag}</span></div><p>{p.content}</p><div className="post-actions"><button onClick={()=>like(p.id)}><Heart weight="duotone"/> 感同身受 {p.likes}</button><button onClick={()=>setCommenting(commenting===p.id?null:p.id)}><ChatCircle weight="duotone"/> 支持 {p.comments.length}</button></div>{p.comments.length>0&&<div className="comments">{p.comments.map((c,i)=><div key={i}><span>匿名邻居</span>{c}</div>)}</div>}{commenting===p.id&&<div className="comment-box"><input autoFocus value={comment} onChange={e=>setComment(e.target.value)} placeholder="留下一句温柔的支持……" onKeyDown={e=>e.key==="Enter"&&addComment(p.id)}/><button onClick={()=>addComment(p.id)}><PaperPlaneTilt/></button></div>}</GlassCard>)}</div></div><aside className="community-side"><GlassCard><Sparkle weight="duotone"/><h3>社区温柔公约</h3><p>尊重每一种感受，不评判、不说教，保护彼此的隐私。</p><ul><li><Check/>真诚表达</li><li><Check/>善意回应</li><li><Check/>不传播隐私</li></ul></GlassCard><GlassCard><h3>今日共鸣</h3><div className="big-number">328</div><p>次温柔回应在社区发生</p></GlassCard></aside></div>
    {composer&&<div className="modal-backdrop" onMouseDown={()=>setComposer(false)}><div className="modal-card composer" onMouseDown={e=>e.stopPropagation()}><button className="icon-btn modal-close" onClick={()=>setComposer(false)}><X/></button><div className="modal-icon"><PencilSimple weight="duotone"/></div><h2>写下此刻的心绪</h2><p>你的身份不会显示，愿这里成为安全的树洞。</p><textarea autoFocus value={text} onChange={e=>setText(e.target.value)} placeholder="今天发生了什么？你想被怎样理解……"/><div className="composer-foot"><span><LockKey/>匿名发布 · 隐私保护</span><button className="primary-btn" onClick={publish} disabled={!text.trim()}>发布心绪 <PaperPlaneTilt/></button></div></div></div>}
  </>;
}

function Activities({ joined,setJoined }) {
  const [filter,setFilter]=useState("全部"); const [selected,setSelected]=useState(null); const cats=["全部","身心练习","自然疗愈","表达疗愈","邻里陪伴"]; const shown=filter==="全部"?activities:activities.filter(a=>a.category===filter);
  const join=a=>{setJoined([...new Set([...joined,a.id])]);setSelected(null)};
  return <><PageIntro eyebrow="线下活动" title="走到彼此身边，让疗愈发生" desc="在社区熟悉的角落，与同伴一起感受真实、温暖的连接。"/><div className="activity-filters">{cats.map(c=><button key={c} className={filter===c?"active":""} onClick={()=>setFilter(c)}>{c}</button>)}</div><div className="activity-grid">{shown.map(a=>{const isJoined=joined.includes(a.id);return <GlassCard className="activity-card" key={a.id}><div className={`activity-cover ${a.tone}`}><Leaf weight="thin"/><span>{a.category}</span><b>{a.date.split(" ")[0]}</b></div><div className="activity-body"><h3>{a.title}</h3><p><CalendarDots/><span>{a.date} · {a.time}</span></p><p><MapPin/><span>{a.place}</span></p><p><UserCircle/><span>{a.host}</span></p><div className="capacity"><div><i style={{width:`${((a.joined+(isJoined?1:0))/a.capacity)*100}%`}}/></div><span>{a.joined+(isJoined?1:0)}/{a.capacity} 人</span></div><button className={isJoined?"joined-btn":"primary-btn full"} onClick={()=>isJoined?setJoined(joined.filter(id=>id!==a.id)):setSelected(a)}>{isJoined?<><Check/>已报名 · 取消报名</>:"查看并报名"}</button></div></GlassCard>})}</div>
    {selected&&<div className="modal-backdrop" onMouseDown={()=>setSelected(null)}><div className="modal-card activity-modal" onMouseDown={e=>e.stopPropagation()}><button className="icon-btn modal-close" onClick={()=>setSelected(null)}><X/></button><div className={`modal-banner ${selected.tone}`}><Leaf weight="thin"/></div><span className="soft-label">{selected.category}</span><h2>{selected.title}</h2><p>这是一次温和、无压力的社区疗愈体验。你无需具备任何基础，只需带着自己来到这里。</p><div className="detail-list"><span><CalendarDots/>{selected.date} · {selected.time}</span><span><MapPin/>{selected.place}</span><span><UserCircle/>{selected.host}</span></div><button className="primary-btn full" onClick={()=>join(selected)}>确认报名 <Check/></button></div></div>}
  </>;
}

function Profile({ moodLogs, posts, joined }) {
  const [report,setReport]=useState(false);
  const stats=[{label:"情绪记录",value:12+moodLogs.length,unit:"天",Icon:Smiley},{label:"疗愈练习",value:8,unit:"次",Icon:Headphones},{label:"温柔回应",value:posts.reduce((n,p)=>n+p.comments.length,0)+18,unit:"次",Icon:Heart},{label:"参与活动",value:joined.length+2,unit:"场",Icon:CalendarDots}];
  const bars=[{name:"平静",value:72},{name:"愉悦",value:61},{name:"一般",value:44},{name:"低落",value:28},{name:"焦虑",value:18}];
  return <><PageIntro eyebrow="个人中心" title="林语的疗愈手帐" desc="所有微小的照顾，都在慢慢汇成更稳定的自己。" action={<button className="secondary-btn"><PencilSimple/>编辑资料</button>}/>
    <div className="profile-hero"><div className="profile-avatar">林<span><Leaf/></span></div><div><h2>林语</h2><p>加入 HealHub 的第 86 天</p><div className="level"><i/><span>温柔探索者 · Lv.4</span></div></div><div className="streak"><Fire weight="duotone"/><b>连续打卡 5 天</b><small>再坚持 2 天解锁新徽章</small></div></div>
    <div className="stats-grid">{stats.map(({label,value,unit,Icon})=><GlassCard key={label} className="stat-card"><Icon weight="duotone"/><span><b>{value}<small>{unit}</small></b><p>{label}</p></span></GlassCard>)}</div>
    <div className="profile-grid"><GlassCard className="emotion-analysis"><div className="card-heading"><div><span className="eyebrow">过去30天</span><h3>情绪分布</h3></div><span className="status-pill">稳定向好</span></div><div style={{height:260}}><ResponsiveContainer><BarChart data={bars} layout="vertical" margin={{left:0,right:25}}><CartesianGrid horizontal={false} stroke="#e1e8e5"/><XAxis type="number" hide/><YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{fill:"#5d6c68"}}/><Tooltip cursor={{fill:"rgba(93,146,137,.06)"}} contentStyle={{border:0,borderRadius:12}}/><Bar dataKey="value" fill="#679f94" radius={[0,10,10,0]} barSize={18}/></BarChart></ResponsiveContainer></div></GlassCard><GlassCard className="ai-report"><div className="report-icon"><FileText weight="duotone"/></div><span className="soft-label"><Sparkle/> AI月度洞察</span><h3>六月情绪疗愈报告</h3><p>本月你的平静时刻增加了 18%，周末户外活动与高质量睡眠是积极变化的重要来源。</p><div className="report-quote">“你正在学习不急着否定自己的感受。”</div><button className="primary-btn full" onClick={()=>setReport(true)}>查看完整报告 <ArrowRight/></button></GlassCard><GlassCard className="badges"><div className="card-heading"><div><span className="eyebrow">成长足迹</span><h3>我的徽章</h3></div><span>已获得 6 枚</span></div><div className="badge-grid">{[["七日坚持",Fire],["善意回声",Heart],["静心初见",Leaf],["勇敢表达",ChatCircleDots],["社区同行",UsersThree],["夜晚安睡",MoonStars]].map(([b,I],i)=><div key={b} className={`badge-item b${i}`}><span><I weight="duotone"/></span><b>{b}</b><small>{i<4?"已获得":"待解锁"}</small></div>)}</div></GlassCard></div>
    {report&&<div className="modal-backdrop" onMouseDown={()=>setReport(false)}><div className="modal-card report-modal" onMouseDown={e=>e.stopPropagation()}><button className="icon-btn modal-close" onClick={()=>setReport(false)}><X/></button><span className="soft-label"><Sparkle/> HealHub AI 洞察</span><h2>六月疗愈报告</h2><div className="report-score"><span>情绪稳定度</span><b>82<small>/100</small></b></div><h3>这个月，你做得很好</h3><p>你记录了更多平静与愉悦的时刻。数据显示，晚间冥想和社区散步之后，你的情绪通常会提升 1–2 个等级。</p><h3>给下个月的小建议</h3><ul><li>保持每周至少两次户外活动</li><li>睡前减少信息输入，继续 10 分钟舒缓冥想</li><li>低落时先照顾身体，再处理问题</li></ul><button className="primary-btn full" onClick={()=>setReport(false)}>收下这份报告 <Heart/></button></div></div>}
  </>;
}

function AppRoutes() {
  const [moodLogs,setMoodLogs]=useLocalStorage("healhub-moods",[]); const [posts,setPosts]=useLocalStorage("healhub-posts",initialPosts); const [joined,setJoined]=useLocalStorage("healhub-joined",[]);
  return <Layout><Routes><Route path="/" element={<Home moodLogs={moodLogs} setMoodLogs={setMoodLogs}/>}/><Route path="/mood" element={<MoodSpace moodLogs={moodLogs} setMoodLogs={setMoodLogs}/>}/><Route path="/ai" element={<AIRoom/>}/><Route path="/community" element={<Community posts={posts} setPosts={setPosts}/>}/><Route path="/activities" element={<Activities joined={joined} setJoined={setJoined}/>}/><Route path="/profile" element={<Profile moodLogs={moodLogs} posts={posts} joined={joined}/>}/></Routes></Layout>;
}

export function App(){return <HashRouter><AppRoutes/></HashRouter>}
