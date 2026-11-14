const PIN = "356301"; // Change this PIN before publishing if desired. This browser-only starter is not secure authentication.
const $ = id => document.getElementById(id);
let products = JSON.parse(localStorage.getItem("grace_products") || "[]");
let logoData = localStorage.getItem("grace_logo") || "";
let currentFilter = "all";
function save(){localStorage.setItem("grace_products",JSON.stringify(products));render();}
function render(){
 const grid=$("productGrid"); grid.innerHTML="";
 const shown=products.filter(p=>currentFilter==="all"||p.category===currentFilter);
 $("empty").style.display=shown.length?"none":"block";
 shown.forEach(p=>{
  const card=document.createElement("article");card.className="product";
  const img=document.createElement("img");img.src=p.image||"";
  img.alt=p.name; if(!p.image){img.style.display="none";}
  const info=document.createElement("div");info.className="product-info";
  const h=document.createElement("h3");h.textContent=p.name;
  const d=document.createElement("p");d.textContent=p.description||"";
  const price=document.createElement("p");price.className="price";price.textContent=p.price?`₹${p.price}`:"";
  info.append(h,d,price);card.append(img,info);grid.append(card);
 });
 renderAdmin();
}
function applyLogo(){if(logoData){$("logoBox").innerHTML=`<img alt="Grace logo" src="${logoData}">`;}else{$("logoBox").textContent="G";}}
function show(id){$(id).classList.remove("hidden")}function hide(id){$(id).classList.add("hidden")}
$("adminOpen").onclick=()=>show("loginModal");
document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>hide(b.dataset.close));
$("loginBtn").onclick=()=>{if($("pinInput").value===PIN){hide("loginModal");$("pinInput").value="";$("loginError").textContent="";show("adminModal");}else{$("loginError").textContent="गलत PIN. फिर से कोशिश करें।";}};
$("pinInput").addEventListener("keydown",e=>{if(e.key==="Enter")$("loginBtn").click();});
$("logoutBtn").onclick=()=>hide("adminModal");
document.querySelectorAll(".filter").forEach(b=>b.onclick=()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");currentFilter=b.dataset.filter;render();});
function fileAsData(file){return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file);});}
$("logoUpload").onchange=async e=>{const f=e.target.files[0];if(!f)return;logoData=await fileAsData(f);localStorage.setItem("grace_logo",logoData);applyLogo();e.target.value="";};
$("removeLogo").onclick=()=>{logoData="";localStorage.removeItem("grace_logo");applyLogo();};
$("saveProduct").onclick=async()=>{
 const name=$("pName").value.trim();if(!name){alert("Product name लिखें।");return;}
 const id=$("editId").value;const old=products.find(p=>p.id===id);
 const file=$("pImage").files[0];const image=file?await fileAsData(file):(old?.image||"");
 const item={id:id||String(Date.now()),name,price:$("pPrice").value.trim(),category:$("pCategory").value,description:$("pDescription").value.trim(),image};
 if(id)products=products.map(p=>p.id===id?item:p);else products.unshift(item);
 save();clearForm();
};
function clearForm(){$("editId").value="";$("pName").value="";$("pPrice").value="";$("pCategory").value="jewellery";$("pDescription").value="";$("pImage").value="";$("saveProduct").textContent="Save Product";}
$("cancelEdit").onclick=clearForm;
function renderAdmin(){
 const root=$("adminProducts");if(!root)return;root.innerHTML="";
 products.forEach(p=>{const row=document.createElement("div");row.className="admin-item";const label=document.createElement("span");label.textContent=p.name+(p.category==="purse"?" · Purse":" · Jewellery");const controls=document.createElement("div");const edit=document.createElement("button");edit.className="secondary";edit.textContent="Edit";edit.onclick=()=>{ $("editId").value=p.id;$("pName").value=p.name;$("pPrice").value=p.price||"";$("pCategory").value=p.category;$("pDescription").value=p.description||"";$("saveProduct").textContent="Update Product";};const del=document.createElement("button");del.className="secondary danger";del.textContent="Delete";del.onclick=()=>{if(confirm("इस product को delete करें?")){products=products.filter(x=>x.id!==p.id);save();}};controls.append(edit,del);row.append(label,controls);root.append(row);});
}
$("year").textContent=new Date().getFullYear();applyLogo();render();