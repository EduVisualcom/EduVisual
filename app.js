let items=[], cats=[
 ["Matematik","∑","Kesirler, geometri"],
 ["Fen Bilimleri","⚗","Deney, bilim"],
 ["Finans","₺","Bütçe, tasarruf"],
 ["İnfografik","◈","Şema, veri, süreç"],
 ["Etkinlik","✦","Çalışma ve oyun"],
 ["Arka Plan","▧","Sayfa dekorları"]
];
const grid=document.querySelector("#grid"), count=document.querySelector("#count"), empty=document.querySelector("#empty");
let activeFilter="";

function card(x){
 return `<article class="card" onclick="location.href='gorsel-${x.id}.html'">
 <div class="thumb"><img src="assets/previews/${x.file}" alt="${x.title}" loading="lazy"></div>
 <div class="info"><span class="pill">${x.category}</span><h3>${x.title}</h3><p>${x.grade} • ${x.type}</p></div></article>`;
}
function render(list){
 grid.innerHTML=list.map(card).join("");
 count.textContent=list.length+" görsel";
 empty.style.display=list.length?"none":"block";
}
function setActive(label){
 document.querySelectorAll(".cat").forEach(b=>b.classList.toggle("active",b.dataset.category===label));
}
function search(q){
 q=(q||"").trim().toLocaleLowerCase("tr-TR");
 activeFilter=q;
 setActive(q ? cats.find(c=>c[0].toLocaleLowerCase("tr-TR")===q)?.[0] || "" : "");
 render(q ? items.filter(x=>
   (x.title+" "+x.category+" "+x.subcategory+" "+x.tags.join(" ")+" "+x.grade+" "+x.desc)
   .toLocaleLowerCase("tr-TR").includes(q)
 ) : items);
 document.querySelector("#yeniler")?.scrollIntoView({behavior:"smooth"});
}
function categoryClick(label){
 const normalized=label.toLocaleLowerCase("tr-TR");
 const same=activeFilter===normalized;
 const q=same?"":label;
 document.querySelector("#q").value=q;
 search(q);
}
function clearFilter(){
 document.querySelector("#q").value="";
 search("");
}
fetch("data.json").then(r=>r.json()).then(d=>{
 items=d; render(items);
 document.querySelector("#cats").innerHTML=cats.map(c=>
  `<button class="cat" data-category="${c[0]}" onclick="categoryClick('${c[0]}')">
   <b>${c[1]}</b><strong>${c[0]}</strong><span>${c[2]}</span>
  </button>`).join("");
 document.querySelector("#chips").innerHTML=
  cats.slice(0,4).map(c=>`<button onclick="categoryClick('${c[0]}')">${c[0]}</button>`).join("")+
  `<button onclick="clearFilter()">Tümünü göster</button>`;
});
document.querySelector("#go").onclick=()=>search(document.querySelector("#q").value);
document.querySelector("#q").onkeydown=e=>{if(e.key==="Enter")search(e.target.value)};
