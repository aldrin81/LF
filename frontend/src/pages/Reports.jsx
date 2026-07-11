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



// ================= DATA PROCESSING =================


const lostItems =
items.filter(
item=>item.type==="Lost"
);


const surrendered =
items.filter(
item=>item.type==="Surrendered"
);



const claimed =
items.filter(
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

items.forEach(item=>{

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


items.forEach(item=>{

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

items.forEach(item=>{

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


const totalItems = items.length;


const topHotspot =
areaStats[0]?.area || "None";




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


      {/* PRINT BUTTON */}

      <div className="flex justify-end no-print">

        <button

        onClick={()=>window.print()}

        className="
        flex items-center gap-2
        bg-[#2D366D]
        text-white
        px-5 py-3
        rounded-xl
        font-black
        text-sm
        hover:opacity-90
        "

        >

          <Printer size={18}/>

          Print Report

        </button>


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

  Generated from live campus item records.

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






{/* ITEM ACTIVITY COMPARISON */}

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




{/* STATUS BREAKDOWN */}

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

      {/* CATEGORY REPORT */}



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










      {/* LOCATION TABLE */}


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
      </div>
    </div>
  </>
);

}