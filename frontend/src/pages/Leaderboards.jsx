import React, { useEffect, useState } from "react";

import {
  getLeaderboard,
  getLeaderboardSettings,
  updateLeaderboardSettings,
  getCurrentUser,
} from "../api/api";

import { useLocation } from "react-router-dom";


function Leaderboard() {

  const location = useLocation();

  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentUser, setCurrentUser] = useState(null);
  const [settings, setSettings] = useState(null);

  const [showSettings, setShowSettings] = useState(false);


  const isDashboard =
    location.pathname.startsWith("/dashboard");



  useEffect(() => {

    fetchLeaderboard();
    fetchSettings();
    fetchCurrentUser();


    const interval = setInterval(() => {

      fetchLeaderboard();
      fetchSettings();

    }, 3000);


    return () => clearInterval(interval);

  }, []);




  const fetchLeaderboard = async () => {

    try {

      const data = await getLeaderboard();


      if (data.active) {

        setLeaders(data.leaders);

      } else {

        setLeaders([]);

      }

    } catch(error) {

      console.log(
        "Leaderboard error:",
        error
      );

    } finally {

      setLoading(false);

    }

  };




  const fetchSettings = async () => {

    try {

      const data =
        await getLeaderboardSettings();


     setSettings({

...data,

open_date:data.open_date || "",

close_date:data.close_date || ""

});

    } catch(error) {

      console.log(
        "Settings error:",
        error
      );

    }

  };




  const fetchCurrentUser = async () => {

    try {

      const user =
        await getCurrentUser();


      setCurrentUser(user);

    } catch(error) {

      console.log(error);

    }

  };




  const saveSettings = async () => {

    try {

      await updateLeaderboardSettings(
        settings
      );


      alert(
        "Leaderboard updated!"
      );


      setShowSettings(false);


      fetchSettings();
      fetchLeaderboard();

    } catch(error) {

      console.log(error);

    }

  };




  const topLeaders =
    leaders.slice(0,3);


  const otherLeaders =
    leaders.slice(3);




  return (

    <div className="mx-auto max-w-6xl p-4 sm:p-6">

      <div className="mb-6 flex items-center justify-between">

        <div>

          <h2 className="text-2xl sm:text-3xl font-black text-[#163B65]">
            Honest Finders Leaderboard
          </h2>


          <p className="mt-2 text-sm text-slate-500">
            Ranked by earned surrender and claim points
          </p>



          {settings && (

            <div className="mt-3">

              <span
                className={`rounded-full px-3 py-1 text-sm font-bold ${
                  settings.is_active
                  ?
                  "bg-green-100 text-green-700"
                  :
                  "bg-red-100 text-red-700"
                }`}
              >

                {
                  settings.is_active
                  ?
                  "🟢 Leaderboard Active"
                  :
                  "🔴 Leaderboard Inactive"
                }

              </span>

            </div>

          )}

        </div>




        {
          isDashboard &&
          (
            currentUser?.role === "admin" ||
            currentUser?.role === "moderator"
          )
          &&

          <button
            onClick={() => setShowSettings(true)}
            className="
              rounded-xl
              bg-[#0B6FA4]
              px-5
              py-3
              font-bold
              text-white
              hover:bg-[#095b87]
            "
          >

            Manage Leaderboard

          </button>

        }

      </div>





      <div
        className="
          overflow-hidden
          rounded-2xl
          border
          border-[#D8E2EE]
          bg-white
          shadow-sm
        "
      >

        {
          loading ? (

            <div className="py-20 text-center text-slate-400">

              Loading leaderboard...

            </div>


          ) : settings && !settings.is_active ? (

            <div className="px-4 py-20 text-center">

              <h3 className="text-xl font-black text-slate-600">
                Leaderboard Disabled
              </h3>


              <p className="mt-2 text-slate-400">
                Administrator has disabled rankings.
              </p>

            </div>


          ) : leaders.length === 0 ? (

            <div className="px-4 py-20 text-center">

              <h3 className="text-lg font-bold text-slate-600">
                No Rankings Available Yet
              </h3>


              <p className="mt-2 text-slate-400">
                Rankings will appear once surrendered items earn points.
              </p>

            </div>


          ) : (

            <div className="space-y-8 p-4 sm:p-6">


              <section>

                <div className="mb-4 flex items-center justify-between">

                  <h3 className="text-lg font-black text-[#0B6FA4]">
                    Top Finders
                  </h3>


                  <span
                    className="
                      rounded-full
                      bg-[#EAF6FC]
                      px-3
                      py-1
                      text-sm
                      font-bold
                      text-[#0B6FA4]
                    "
                  >
                    {leaders.length} ranked
                  </span>

                </div>





                <div className="mx-auto w-full max-w-4xl">

                  <div
                    className="
                      grid
                      grid-cols-[0.8fr_1fr_0.8fr]
                      items-end
                      gap-2
                      sm:gap-4
                    "
                  >


                    {/* SECOND PLACE */}

                    <div>

                      {
                        topLeaders[1] ? (

                          <div
                            className="
                              min-h-[120px]
                              sm:min-h-[210px]
                              rounded-t-3xl
                              border
                              border-slate-300
                              bg-slate-100
                              p-3
                              sm:p-5
                              text-center
                              flex
                              flex-col
                              justify-between
                            "
                          >

                            <div>

                              <div
                                className="
                                  mx-auto
                                  flex
                                  h-10
                                  w-10
                                  sm:h-14
                                  sm:w-14
                                  items-center
                                  justify-center
                                  rounded-full
                                  bg-slate-300
                                  font-black
                                  text-slate-800
                                "
                              >
                                2
                              </div>


                              <h4
                                className="
                                  mt-3
                                  text-sm
                                  sm:text-base
                                  font-black
                                  break-words
                                "
                              >
                                {topLeaders[1].full_name}
                              </h4>

                            </div>


                            <div
                              className="
                                rounded-xl
                                bg-white
                                py-2
                                font-black
                                text-[#0B6FA4]
                              "
                            >
                              {topLeaders[1].points} pts
                            </div>

                          </div>

                        ) : (

                          <div />

                        )

                      }

                    </div>

                    {/* FIRST PLACE */}

<div>

{
  topLeaders[0] ? (

    <div
      className="
      min-h-[150px]
      sm:min-h-[260px]
      rounded-t-3xl
      border-2
      border-yellow-400
      bg-yellow-50
      p-3
      sm:p-5
      text-center
      shadow-md
      flex
      flex-col
      justify-between
      "
    >


      <div>


        <div
          className="
          mx-auto
          flex
          h-12
          w-12
          sm:h-16
          sm:w-16
          items-center
          justify-center
          rounded-full
          bg-yellow-400
          font-black
          text-yellow-950
          text-xl
          "
        >

          1

        </div>



        <h4
          className="
          mt-3
          sm:mt-4
          font-black
          break-words
          "
        >

          {topLeaders[0].full_name}

        </h4>


        <p
          className="
          mt-1
          text-sm
          text-slate-500
          "
        >

          {topLeaders[0].student_id}

        </p>


      </div>





      <div
        className="
        rounded-xl
        bg-white
        py-2
        font-black
        text-[#0B6FA4]
        "
      >

        {topLeaders[0].points} pts

      </div>


    </div>


  )

  :

  (

    <div />

  )

}


</div>







{/* THIRD PLACE */}

<div>


{
  topLeaders[2] ? (

    <div
      className="
      min-h-[110px]
      sm:min-h-[185px]
      rounded-t-3xl
      border
      border-orange-300
      bg-orange-50
      p-3
      sm:p-5
      text-center
      flex
      flex-col
      justify-between
      "
    >


      <div>


        <div
          className="
          mx-auto
          flex
          h-10
          w-10
          sm:h-14
          sm:w-14
          items-center
          justify-center
          rounded-full
          bg-orange-300
          font-black
          text-orange-950
          "
        >

          3

        </div>




        <h4
          className="
          mt-3
          text-sm
          sm:text-base
          font-black
          break-words
          "
        >

          {topLeaders[2].full_name}

        </h4>



        <p
          className="
          mt-1
          text-xs
          text-slate-500
          "
        >

          {topLeaders[2].student_id}

        </p>


      </div>






      <div
        className="
        rounded-xl
        bg-white
        py-2
        font-black
        text-[#0B6FA4]
        "
      >

        {topLeaders[2].points} pts

      </div>



    </div>


  )

  :

  (

    <div />

  )

}


</div>





</div>

</div>


</section>

<section>


<div
  className="
  mb-4
  flex
  items-center
  justify-between
  "
>


<h3
  className="
  text-lg
  font-black
  text-[#0B6FA4]
  "
>

Other Rankings

</h3>




{
  otherLeaders.length > 0 && (

    <span
      className="
      rounded-full
      bg-[#EAF6FC]
      px-3
      py-1
      text-sm
      font-bold
      text-[#0B6FA4]
      "
    >

      Rank 4+

    </span>

  )

}


</div>







{
  otherLeaders.length === 0 ? (

    <div
      className="
      rounded-2xl
      border
      border-slate-200
      bg-slate-50
      px-4
      py-10
      text-center
      text-slate-400
      "
    >

      No other rankings yet

    </div>


  )

  :

  (

    <div className="space-y-3">


    {
      otherLeaders.map((leader,index)=>(


        <div

          key={leader.id}

          className="
          flex
          flex-col
          gap-4
          rounded-2xl
          border
          border-slate-200
          bg-slate-50
          p-4
          shadow-sm
          sm:flex-row
          sm:items-center
          sm:justify-between
          "

        >



          <div
            className="
            flex
            items-center
            gap-4
            "
          >



            <div

              className="
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-slate-300
              font-black
              text-slate-800
              "

            >

              {index + 4}

            </div>






            <div>


              <p

                className="
                font-black
                text-slate-900
                "

              >

                {leader.full_name}

              </p>




              <p

                className="
                text-sm
                text-slate-500
                "

              >

                {leader.student_id}

              </p>


            </div>


          </div>







          <div

            className="
            rounded-xl
            bg-white
            px-4
            py-3
            font-black
            text-[#0B6FA4]
            "

          >

            {leader.points} pts

          </div>




        </div>


      ))

    }


    </div>

  )

}


</section>





</div>

)

}


</div>







{/* SETTINGS MODAL */}

{
showSettings &&
settings &&

<div
className="
fixed
inset-0
z-50
flex
items-center
justify-center
bg-black/40
"
>


<div
className="
w-full
max-w-lg
rounded-3xl
bg-white
p-8
"
>



<h2
className="
text-2xl
font-black
"
>

Leaderboard Settings

</h2>





{/* STATUS */}

<div className="mt-6">


<label
className="
font-bold
"
>

Leaderboard Status

</label>



<div
className="
mt-3
flex
gap-3
"
>



<button

onClick={()=>{

const confirmActivate = window.confirm(
"Are you sure you want to activate the leaderboard?"
);


if(confirmActivate){

setSettings({

...settings,

is_active:true

});

}

}}

className="
rounded-xl
bg-green-600
px-4
py-2
font-bold
text-white
"

>

Activate

</button>







<button

onClick={()=>{

const confirmDeactivate = window.confirm(
"Are you sure you want to deactivate the leaderboard?\n\nAll rankings will be hidden."
);


if(confirmDeactivate){

setSettings({

...settings,

is_active:false

});

}

}}

className="
rounded-xl
bg-red-600
px-4
py-2
font-bold
text-white
"

>

Deactivate

</button>



</div>


</div>







{/* AUTOMATIC MODE */}


<div
className="
mt-8
"
>



<label
className="
flex
items-center
gap-3
"
>


<input

type="checkbox"


checked={
settings.auto_mode
}


onChange={(e)=>{


setSettings({

...settings,

auto_mode:
e.target.checked


});


}}


/>


<span
className="
font-bold
"
>

Automatic Mode

</span>


</label>


</div>








{/* DATE SETTINGS */}



{
settings.auto_mode &&


<div
className="
mt-6
space-y-5
"
>


<div>


<label
className="
font-bold
"
>

Activation Date

</label>


<input

type="date"


value={
settings.open_date || ""
}


onChange={(e)=>{


setSettings({

...settings,

open_date:e.target.value

});


}}


className="
mt-2
w-full
rounded-xl
border
p-3
"

/>


</div>







<div>


<label
className="
font-bold
"
>

Deactivation Date

</label>



<input


type="date"



value={
settings.close_date || ""
}



onChange={(e)=>{


setSettings({

...settings,

close_date:e.target.value

});


}}



className="
mt-2
w-full
rounded-xl
border
p-3
"

/>



</div>



</div>


}









{/* BUTTONS */}



<div
className="
mt-8
flex
justify-end
gap-3
"
>



<button

onClick={()=>setShowSettings(false)}

className="
rounded-xl
border
px-5
py-3
font-bold
"

>

Cancel

</button>







<button

onClick={saveSettings}


className="
rounded-xl
bg-[#0B6FA4]
px-5
py-3
font-bold
text-white
"

>

Save

</button>



</div>






</div>


</div>


}


</div>

);

}


export default Leaderboard;