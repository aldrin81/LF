import React, { useEffect, useState } from "react";
import {
  Award,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Sparkles,
  Printer
} from "lucide-react";
import { getItems } from "../api/api";

import { useLocation } from "react-router-dom";
// ================= HELPERS =================

const pct = (a, b) =>
  b === 0 ? 0 : Math.round((a / b) * 100);


const riskLevel = (lost) =>
  lost >= 15
    ? "High Risk"
    : lost >= 8
    ? "Medium Risk"
    : "Low Risk";


const riskColor = (risk) =>
  risk.startsWith("High")
    ? "bg-rose-50 text-rose-600 border border-rose-100"
    : risk.startsWith("Medium")
    ? "bg-amber-50 text-amber-600 border border-amber-100"
    : "bg-emerald-50 text-emerald-600 border border-emerald-100";


const pctColor = (p) =>
  p >= 70
    ? "text-emerald-600"
    : p >= 50
    ? "text-amber-600"
    : "text-rose-500";


// ================= STAT CARD =================

const StatCard = ({
  label,
  count,
  icon: Icon,
  color,
  bgColor,
  description
}) => (
  <div className="bg-white p-6 rounded-3xl border shadow-sm print:shadow-none">

    <div className="flex justify-between">

      <div>
        <p className="text-[10px] uppercase font-black text-slate-400">
          {label}
        </p>

        <h3 className="text-3xl font-black text-slate-800">
          {count}
        </h3>
      </div>


      <div className={`${bgColor} ${color} p-3 rounded-xl`}>
        <Icon size={20}/>
      </div>

    </div>


    <p className="mt-4 text-xs text-slate-400">
      {description}
    </p>

  </div>
);



// ================= DONUT =================

const Donut = ({
  value,
  label,
  color="#2D366D"
}) => {

  const radius = 55;
  const circumference = 2 * Math.PI * radius;

  const progress =
    (value / 100) * circumference;


  return (

    <svg width="160" height="160">

      <circle
        cx="80"
        cy="80"
        r={radius}
        stroke="#E2E8F0"
        strokeWidth="20"
        fill="none"
      />


      <circle
        cx="80"
        cy="80"
        r={radius}
        stroke={color}
        strokeWidth="20"
        fill="none"
        strokeDasharray={`${progress} ${circumference}`}
        transform="rotate(-90 80 80)"
      />


      <text
        x="80"
        y="75"
        textAnchor="middle"
        fontSize="25"
        fontWeight="900"
        fill="#2D366D"
      >
        {value}%
      </text>


      <text
        x="80"
        y="98"
        textAnchor="middle"
        fontSize="9"
        fontWeight="900"
        fill="#94A3B8"
      >
        {label}
      </text>

    </svg>

  );

};



// ================= HORIZONTAL BAR =================

const HBar = ({
  value,
  max,
  color="#2D366D"
}) => (

<div className="h-3 bg-slate-100 rounded-full overflow-hidden">

  <div
    className="h-full rounded-full"
    style={{
      width:`${max ? (value/max)*100 : 0}%`,
      background:color
    }}
  />

</div>

);

const BarChart = ({data}) => {

const max = Math.max(...data.map(x=>x.value),1);

return (

<div className="space-y-4">

{data.map((item,index)=>(

<div key={index}>

<div className="flex justify-between text-xs font-bold mb-2">
<span>{item.label}</span>
<span>{item.value}</span>
</div>

<div className="h-4 bg-slate-100 rounded-full overflow-hidden">

<div
className="h-full bg-[#2D366D] rounded-full"
style={{
width:`${(item.value/max)*100}%`
}}
/>

</div>

</div>

))}

</div>

)

}



// ================= MAIN =================


export default function Reports(){


const [items,setItems] = useState([]);

const [loading,setLoading] = useState(true);
const [startDate, setStartDate] = useState("");
const [endDate, setEndDate] = useState("");
const [selectedType, setSelectedType] = useState("All");
const [selectedStatus, setSelectedStatus] = useState("All");
const [selectedCategory, setSelectedCategory] = useState("All");
const [selectedLocation, setSelectedLocation] = useState("All");
const [printSections, setPrintSections] = useState({
  recovery: true,
  activity: true,
  status: true,
  category: true,
  hotspot: true,
});
 const location = useLocation();

useEffect(() => {

  async function fetchItems(){

    try{

      const data = await getItems();

      setItems(data || []);

    }
    catch(error){

      console.log(
        "Reports fetch error:",
        error
      );

    }
    finally{

      setLoading(false);

    }

  }


  fetchItems();


  const interval = setInterval(()=>{

    fetchItems();

  },5000);


  return () => clearInterval(interval);


},[]);

// ================= FILTER ITEMS =================

const filteredItems = items.filter((item) => {
  const itemDate = new Date(item.created_date);

  if (startDate && itemDate < new Date(startDate)) return false;
  if (endDate && itemDate > new Date(endDate)) return false;

  if (selectedType !== "All" && item.type !== selectedType)
    return false;

  if (selectedStatus !== "All" && item.status !== selectedStatus)
    return false;

  if (selectedCategory !== "All" && item.category !== selectedCategory)
    return false;

  if (selectedLocation !== "All" && item.location !== selectedLocation)
    return false;

  return true;
});

// ================= DATA PROCESSING =================



const lostItems =
filteredItems.filter(
item=>item.type==="Lost"
);




const surrendered =
filteredItems.filter(
item=>item.type==="Surrendered"
);



const claimed =
filteredItems.filter(
item=>
item.status==="Claimed" ||
item.status==="Returned"
);



const recoveryRate =
pct(
claimed.length,
lostItems.length
);



const locations = {};

filteredItems.forEach(item=>{

if(!locations[item.location])
locations[item.location]={
lost:0,
recovered:0
};


if(item.type==="Lost")
locations[item.location].lost++;


if(
item.status==="Claimed" ||
item.status==="Returned"
)
locations[item.location].recovered++;

});



const areaStats =
Object.entries(locations)
.map(([area,data])=>({
area,
...data
}))
.sort(
(a,b)=>b.lost-a.lost
);



const categories={};


filteredItems.forEach(item=>{

categories[item.category] =
(categories[item.category] || 0)+1;

});


const catStats =
Object.entries(categories)
.map(([cat,count])=>({
cat,
count
}));
const statuses = {};

filteredItems.forEach(item=>{

statuses[item.status] =
(statuses[item.status] || 0)+1;

});


const statusStats =
Object.entries(statuses)
.map(([label,value])=>({
label,
value
}));


const comparisonData = [
{
label:"Lost Items",
value:lostItems.length
},
{
label:"Surrendered Items",
value:surrendered.length
},
{
label:"Claimed Items",
value:claimed.length
}
];


const totalItems = filteredItems.length;


const topHotspot =
areaStats[0]?.area || "None";


const toggleSection = (section) => {
  setPrintSections((prev) => ({
    ...prev,
    [section]: !prev[section],
  }));
};

if(loading)

return (

<div className="p-10 text-center font-black">
Loading Reports...
</div>

);



return ( <>

    <style>
    {`

@media print {


  body {

    background:white !important;

  }



  body * {

    visibility:hidden;

  }



  #print-report,
  #print-report * {

    visibility:visible;

  }



  #print-report {


    position:absolute;

    top:0;

    left:0;


    width:117%;


    padding:0 !important;


    background:white !important;



    transform:scale(0.85);

    transform-origin:top left;


  }



  .no-print {

    display:none !important;

  }



  .print-section {

    break-inside:avoid;

    page-break-inside:avoid;

  }



  table {

    page-break-inside:auto;

  }



  tr {

    break-inside:avoid;

    page-break-inside:avoid;

  }



  @page {

    size:A4 portrait;

    margin:8mm;

  }


}

`}
    </style>



    <div className="space-y-6 p-4">
{/* FILTER PANEL */}
<div className="space-y-6 no-print">
  <div className="flex items-center justify-between mb-5">

  <div>
    <h2 className="text-lg font-black text-[#2D366D]">
      Report Filters
    </h2>

    <p className="text-xs text-slate-500">
      Filter the analytical report before printing.
    </p>
  </div>

  <div className="flex items-center gap-3">

    <button
      onClick={() => {
        setStartDate("");
        setEndDate("");
        setSelectedType("All");
        setSelectedStatus("All");
        setSelectedCategory("All");
        setSelectedLocation("All");
      }}
      className="bg-rose-500 hover:bg-rose-600 text-white px-5 py-2 rounded-xl font-bold transition"
    >
      Clear Filters
    </button>

    <button
      onClick={() => window.print()}
      className="flex items-center gap-2 bg-[#2D366D] hover:bg-[#1f2858] text-white px-5 py-2 rounded-xl font-bold transition"
    >
      <Printer size={18}/>
      Print Report
    </button>

  </div>

</div>

<div className="bg-white border rounded-3xl shadow-sm p-6 no-print mt-6">

  <div className="flex items-center justify-between mb-4">

    <div>
      <h3 className="text-sm font-black text-[#2D366D]">
        Reports to Include
      </h3>

      <p className="text-xs text-slate-500 mt-1">
        Select which sections will appear when printing.
      </p>
    </div>

  </div>

  <p className="text-xs text-slate-500 mb-4">
    Select which report sections will appear when printing.
  </p>

  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">



    <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 hover:border-[#2D366D] hover:bg-slate-50 cursor-pointer transition">

  <span className="text-sm font-bold text-slate-700">
    Recovery Performance
  </span>

  <input
    type="checkbox"
    checked={printSections.recovery}
    onChange={() => toggleSection("recovery")}
    className="
      w-5
      h-5
      accent-[#2D366D]
      cursor-pointer
    "
  />

</label>

  <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 hover:border-[#2D366D] hover:bg-slate-50 cursor-pointer transition">

  <span className="text-sm font-bold text-slate-700">
    Item Activity
  </span>

  <input
    type="checkbox"
    checked={printSections.activity}
    onChange={() => toggleSection("activity")}
    className="
      w-5
      h-5
      accent-[#2D366D]
      cursor-pointer
    "
  />

</label>

    <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 hover:border-[#2D366D] hover:bg-slate-50 cursor-pointer transition">

  <span className="text-sm font-bold text-slate-700">
    Status Distribution
  </span>

  <input
    type="checkbox"
    checked={printSections.status}
    onChange={() => toggleSection("status")}
    className="
      w-5
      h-5
      accent-[#2D366D]
      cursor-pointer
    "
  />

</label>

    <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 hover:border-[#2D366D] hover:bg-slate-50 cursor-pointer transition">

  <span className="text-sm font-bold text-slate-700">
Item Categories  </span>

  <input
    type="checkbox"
    checked={printSections.category}
    onChange={() => toggleSection("category")}
    className="
      w-5
      h-5
      accent-[#2D366D]
      cursor-pointer
    "
  />

</label>

    <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 hover:border-[#2D366D] hover:bg-slate-50 cursor-pointer transition">

  <span className="text-sm font-bold text-slate-700">
    Location Hotspots
  </span>

  <input
    type="checkbox"
    checked={printSections.hotspot}
    onChange={() => toggleSection("hotspot")}
    className="
      w-5
      h-5
      accent-[#2D366D]
      cursor-pointer
    "
  />

</label>
  </div>

</div>
</div>
  <div className="bg-white border rounded-3xl shadow-sm p-6 mt-6">

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-5">

    {/* START DATE */}
    <div>
      <label className="block text-xs font-bold text-slate-600 mb-2">
  Generate From
</label>

      <input
        type="date"
        value={startDate}
        onChange={(e)=>setStartDate(e.target.value)}
        className="
          w-full
          rounded-xl
          border
          border-slate-300
          px-3
          py-2.5
          text-sm
          focus:outline-none
          focus:ring-2
          focus:ring-[#2D366D]
          focus:border-[#2D366D]
        "
      />
    </div>

    {/* END DATE */}
    <div>
      <label className="block text-xs font-bold text-slate-600 mb-2">
  Generate Until
</label>

      <input
        type="date"
        value={endDate}
        onChange={(e)=>setEndDate(e.target.value)}
        className="
          w-full
          rounded-xl
          border
          border-slate-300
          px-3
          py-2.5
          text-sm
          focus:outline-none
          focus:ring-2
          focus:ring-[#2D366D]
          focus:border-[#2D366D]
        "
      />
    </div>

    {/* TYPE */}
    <div>
      <label className="block text-xs font-bold text-slate-600 mb-2">
        Type
      </label>

      <select
        value={selectedType}
        onChange={(e)=>setSelectedType(e.target.value)}
        className="
          w-full
          rounded-xl
          border
          border-slate-300
          px-3
          py-2.5
          text-sm
          focus:outline-none
          focus:ring-2
          focus:ring-[#2D366D]
        "
      >
        <option value="All">All</option>
        <option value="Lost">Lost</option>
        <option value="Surrendered">Surrendered</option>
      </select>
    </div>

    {/* STATUS */}
    <div>
      <label className="block text-xs font-bold text-slate-600 mb-2">
        Status
      </label>

      <select
        value={selectedStatus}
        onChange={(e)=>setSelectedStatus(e.target.value)}
        className="
          w-full
          rounded-xl
          border
          border-slate-300
          px-3
          py-2.5
          text-sm
          focus:outline-none
          focus:ring-2
          focus:ring-[#2D366D]
        "
      >
        <option value="All">All</option>
        <option value="Pending">Pending</option>
        <option value="Approved">Approved</option>
        <option value="Claimed">Claimed</option>
        <option value="Returned">Returned</option>
        <option value="Archived">Archived</option>
        <option value="Declined">Declined</option>
      </select>
    </div>

    {/* CATEGORY */}
    <div>
      <label className="block text-xs font-bold text-slate-600 mb-2">
        Category
      </label>

      <select
        value={selectedCategory}
        onChange={(e)=>setSelectedCategory(e.target.value)}
        className="
          w-full
          rounded-xl
          border
          border-slate-300
          px-3
          py-2.5
          text-sm
          focus:outline-none
          focus:ring-2
          focus:ring-[#2D366D]
        "
      >
        <option value="All">All</option>
        <option value="Personal">Personal</option>
        <option value="Accessories">Accessories</option>
        <option value="Id">ID</option>
        <option value="Electronics">Electronics</option>
        <option value="Keys">Keys</option>
        <option value="Valuables">Valuables</option>
      </select>
    </div>

    {/* LOCATION */}
    <div>
      <label className="block text-xs font-bold text-slate-600 mb-2">
        Location
      </label>

      <select
        value={selectedLocation}
        onChange={(e)=>setSelectedLocation(e.target.value)}
        className="
          w-full
          rounded-xl
          border
          border-slate-300
          px-3
          py-2.5
          text-sm
          focus:outline-none
          focus:ring-2
          focus:ring-[#2D366D]
        "
      >
        <option value="All">All</option>
        <option value="Canteen">Canteen</option>
        <option value="Gym">Gym</option>
        <option value="Highschool Grounds">Highschool Grounds</option>
        <option value="Basement">Basement</option>
        <option value="Main Building">Main Building</option>
        <option value="SAO Lobby">SAO Lobby</option>
        <option value="Parking Area">Parking Area</option>
      </select>
    </div>

  </div>

</div>

</div>
    <div>

</div>

      {/* PRINT AREA */}

      <div
      id="print-report"
      className="
      space-y-3
      bg-white
      p-2
      "
      >





<>
      {/* HEADER */}

      <div
      className="
      bg-gradient-to-br
      from-[#2D366D]
      to-[#1E254E]
      rounded-3xl
      p-8
      text-white
      "
      >

        <div className="flex items-center gap-2">

          <Sparkles
          size={18}
          className="text-orange-300"
          />

          <span className="
          text-xs
          font-black
          uppercase
          tracking-widest
          ">

            Analytical Report

          </span>


        </div>


        <h1 className="
        text-4xl
        font-black
        mt-3
        uppercase
        italic
        ">

          Lost & Found Statistics

        </h1>



        <p className="mt-3 text-white/70 text-sm">

  Generated from campus item records
{startDate && endDate && (
  <>
    {" "}from{" "}
    <b>{startDate}</b>
    {" "}to{" "}
    <b>{endDate}</b>
  </>
)}.

  Current recovery efficiency:

  <b className="ml-2 text-white">
    {recoveryRate}%
  </b>

  <br />

  <span className="text-xs text-white/50">
    Generated:
    {" "}
    {new Date().toLocaleDateString()}
    {" "}
  {new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  })}
  </span>

</p>


      </div>
    </>



      {/* STAT CARDS */}


      <div className="
            grid
      grid-cols-2
      lg:grid-cols-4
      gap-4
      print-section
      ">


      <StatCard

      label="Recovery Rate"

      count={`${recoveryRate}%`}

      icon={Award}

      color="text-indigo-600"

      bgColor="bg-indigo-50"

      description={`${claimed.length} recovered cases`}

      />



      <StatCard

      label="Lost Items"

      count={lostItems.length}

      icon={AlertTriangle}

      color="text-rose-600"

      bgColor="bg-rose-50"

      description="Reported missing items"

      />



      <StatCard

      label="Found Items"

      count={surrendered.length}

      icon={CheckCircle2}

      color="text-emerald-600"

      bgColor="bg-emerald-50"

      description="Surrendered items"

      />



      <StatCard

      label="Top Hotspot"

      count={topHotspot}

      icon={MapPin}

      color="text-amber-600"

      bgColor="bg-amber-50"

      description="Highest reported area"

      />



      </div>








      {/* RECOVERY GRAPH */}

{printSections.recovery && (
      <div className="
        bg-white
        rounded-3xl
        p-6
        border
        print-section
      ">


      <h2 className="
      font-black
      uppercase
      text-sm
      tracking-widest
      ">

        Recovery Performance

      </h2>



      <div className="flex justify-center mt-5">


        <Donut

        value={recoveryRate}

        label="RECOVERED"

        />

      </div>


      </div>

)}



{/* ITEM ACTIVITY COMPARISON */}
{printSections.activity && (
<div className="
bg-white
rounded-3xl
p-6
border
print-section
">

<h2 className="
font-black
uppercase
text-sm
tracking-widest
mb-6
">
Item Activity Overview
</h2>

<BarChart
data={comparisonData}
/>

</div>
)}



{/* STATUS BREAKDOWN */}
{printSections.status && (
<div className="
bg-white
rounded-3xl
p-6
border
print-section
">

<h2 className="
font-black
uppercase
text-sm
tracking-widest
mb-6
">
Current Status Distribution
</h2>

<BarChart
data={statusStats}
/>

</div>

)}

      {/* CATEGORY REPORT */}


{printSections.category && (
      <div className="
      bg-white
      rounded-3xl
      p-6
      border
      ">


      <h2 className="
      font-black
      uppercase
      text-sm
      mb-5
      tracking-widest
      ">

        Item Categories

      </h2>




      <div className="space-y-5">


      {catStats.map((cat,index)=>(


      <div key={index}>


      <div className="
      flex
      justify-between
      text-xs
      font-bold
      mb-2
      ">


      <span>
      {cat.cat}
      </span>


      <span>
      {cat.count}
      </span>


      </div>



      <HBar

      value={cat.count}

      max={totalItems}

      />
        

      </div>


      ))}


      </div>


      </div>


)}







      {/* LOCATION TABLE */}

{printSections.hotspot && (
      <div className="
          bg-white
      rounded-3xl
      border
      overflow-hidden
      print-section
      ">



      <div className="p-6">


      <h2 className="
      font-black
      uppercase
      text-sm
      tracking-widest
      ">

      Location Hotspots

      </h2>


      </div>




      <table className="w-full text-sm">


      <thead className="
      bg-slate-100
      text-xs
      uppercase
      ">

      <tr>

      <th className="p-4 text-left">
      Location
      </th>


      <th>
      Lost
      </th>


      <th>
      Recovered
      </th>


      <th>
      Rate
      </th>


      <th>
      Risk
      </th>


      </tr>


      </thead>




      <tbody>


      {areaStats.map((area,index)=>{


      const rate =
      pct(
      area.recovered,
      area.lost
      );


      const risk =
      riskLevel(area.lost);



      return (

      <tr
      key={index}
      className="border-b"
      >


      <td className="
      p-4
      font-black
      ">

      {area.area}

      </td>


      <td className="text-center">

      {area.lost}

      </td>


      <td className="
      text-center
      text-emerald-600
      font-bold
      ">

      {area.recovered}

      </td>



      <td className={`
      text-center
      font-black
      ${pctColor(rate)}
      `}>

      {rate}%

      </td>



      <td className="text-center">


      <span className={`
      px-3 py-1
      rounded-full
      text-xs
      font-black
      ${riskColor(risk)}
      `}>
      {risk}
      </span>
      </td>

      </tr>
      )

      })}
      </tbody>
      </table>
      </div>
      )}
      </div>
 
  </>
);

}