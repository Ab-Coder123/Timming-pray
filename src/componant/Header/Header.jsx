// import React from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Prayer from "../Prayer/Prayer";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { useState, useEffect } from "react";
// import { useForkRef } from "@mui/material";
import axios from "axios";
import moment from "moment";
import "moment/dist/locale/ar-dz";
moment.locale("ar");

function Header() {
  // ***********************************************************************************

  // اولا هنعمل ستيت عشان نستدعي ال الاسماء و الالوقات تبع كل كارد
  const [timmings, settimming] = useState("");

  // timetoday
  const [timetoday, settimetoday] = useState("");
  // timming prayer diff time today
	const [remainingTimes, setRemainingTime] = useState("");

  // state to select city
  const [selectedCity, setSelectedCity] = useState({
    displayName: "مكة المكرمة",
    apiName: "Makkah al Mukarramah",
  });
  // دي بتاعه اسم الصلاه الاتيه
  const [nextPrayerIndex, setNextPrayerIndex] = useState(0);

  // ***********************************************************************************
  // get link api Request

  const gettimming = async () => {
    const respons = await axios.get(
      `https://api.aladhan.com/v1/timingsByCity?country=SA&city=${selectedCity.apiName}`
    );
    // هنا هنستدعي ال ستيت
    settimming(respons.data.data.timings);
  };

  //عشان هنا اول لما نعمل كليك علي ال اخر جزء من الموقع مقدر نجيب اسم المدينه و بتالي نعرف نجيب اسم التايم الصلوات بتاعها  useEffect هنا
  useEffect(() => {
    gettimming();
    setupCountdownTimer();
  }, [selectedCity]);

  // useeffect to create timer with pray
  useEffect(() => {
    // خنا هنجيب ال الوقت بتاع ال كل يوم ل اي دوله
    const t = moment();
    settimetoday(t.format("MMMM / Do / YYYY | h:mm "));
    // عشان تايم يبدا يعد  interval
    let interval = setInterval(() => {
      // هنا هنعمل فانكشن ال فيها ايه الاستخدا اسماء الصلوات و اوقاتها عشان نعرف نقدر نكمل ال تايمر ولا لا من خلال ال فانكشن دا
      setupCountdownTimer();
    }, 1000);

    clearInterval(interval);
  }, [timmings]);

  // condition to compare the time of prayers

  const setupCountdownTimer = () => {
    const momentNow = moment();

    let prayerIndex = 2;
    // دا متغير ال هو مرتبط ب ال اوبجيكت ال من خلاله و من خلال ال كوندشن تقدر تجيب اسم ال صلاه

    if (
      momentNow.isAfter(moment(timmings.Fajr, "hh:mm")) &&
      momentNow.isBefore(moment(timmings.Dhuhr, "hh:mm"))
    ) {
      prayerIndex = 1;
    } else if (
      momentNow.isAfter(moment(timmings.Dhuhr, "hh:mm")) &&
      momentNow.isBefore(moment(timmings.Asr, "hh:mm"))
    ) {
      prayerIndex = 2;
    } else if (
      momentNow.isAfter(moment(timmings.Asr, "hh:mm")) &&
      momentNow.isBefore(moment(timmings.Maghrib, "hh:mm"))
    ) {
      prayerIndex = 3;
    } else if (
      momentNow.isAfter(moment(timmings.Maghrib, "hh:mm")) &&
      momentNow.isBefore(moment(timmings.Isha, "hh:mm"))
    ) {
      prayerIndex = 4;
    } else {
      prayerIndex = 0;
    }
    // دي ال ستيت بتاعه اسماء الصلاه الاتيه
    setNextPrayerIndex(prayerIndex);

          // timming interval 

          const Nextprayerobject = datacontentprayer[prayerIndex]; 
          const nextPrayerTime = timmings[Nextprayerobject.key];
          //  moment ل اوبجيكت  nextPrayerTime هنا هنحول ال 
          const nextPrayerTimeMoment  = moment(nextPrayerTime , "hh:mm") ;
          // ل الوقت الحالي ناقص مواقيت الصلوات  diffrence  كده انتا معاك لوقت بتاع مواقيت الصلاه و دلوقتي بقا هنعمل عمليه .

          let remainingTime = moment(nextPrayerTime , "hh:mm").diff(momentNow);
          // هنا بقا هنعمل كونشن ل مواقيت الصلاه عشان صلاه الفجر 

          if (remainingTime < 0) {
            // دا لو من العشاء ل الفجر 
            const midnightDiff = moment("23:59:59", "hh:mm:ss").diff(momentNow);
            // دا لو من الفجر ل العشاء لانه نتا هنا ف يوم جديد 
		    	  const fajrToMidnightDiff = nextPrayerTimeMoment.diff(moment("00:00:00", "hh:mm:ss") ) ;

            const totalDiffernce = midnightDiff + fajrToMidnightDiff;
            remainingTime = totalDiffernce;
          }
          const durationRemainingTime = moment.duration(remainingTime);
          setRemainingTime(
            `${durationRemainingTime.hours()} : ${durationRemainingTime.minutes()} : ${durationRemainingTime.seconds()}`
          );
  };




  // ***********************************************************************************
  // this object cards and the nextprayer

  const datacontentprayer = [
    {
      name: "العشاء",
      key: "Isha",
      time: timmings.Isha,
      image:
        "https://wepik.com/api/image/ai/9a07bc25-1200-4873-8743-1c370e9eff4d",
    },
    {
      name: "المغرب",
      key: "Sunset",
      time: timmings.Maghrib,
      image:
        "https://wepik.com/api/image/ai/9a07bbe3-4dd1-43b4-942e-1b2597d4e1b5",
    },
    {
      name: "العصر",
      key: "Asr",
      time: timmings.Asr,
      image:
        "https://wepik.com/api/image/ai/9a07bb90-1edc-410f-a29a-d260a7751acf",
    },
    {
      name: "الظهر",
      key: "Dhuhr",
      time: timmings.Dhuhr,
      image:
        "https://wepik.com/api/image/ai/9a07bb45-6a42-4145-b6aa-2470408a2921",
    },

    {
      name: "الفجر",
      key: "Fajr",
      time: timmings.Fajr,
      image:
        "https://wepik.com/api/image/ai/9a07baa7-b49b-4f6b-99fb-2d2b908800c2",
    },
  ];

  //  object with city
  const avilableCities = [
    {
      displayName: "مكة المكرمة",
      apiName: "Makkah al Mukarramah",
    },
    {
      displayName: "الرياض",
      apiName: "Riyadh",
    },
    {
      displayName: "الدمام",
      apiName: "Dammam",
    },
    {
      displayName: "مصر ",
      apiName: "ُCairo",
    },
  ];

  // *************************************************************************

  // 	setSelectedCity(cityObject); بص يصحبي ال فانكشن دا عشان حاجتين اولا عشان لما تيجي تعلم سيليكت ل اي دوله ف ال ايليمنت ال تحت سياق عليه ال فوكس ثانيا عشان تعمل اكتف ل ال ستيت ال عندك ال اسمه
  const handleCityChange = (event) => {
    const cityObject = avilableCities.find((city) => {
      // دا الجزء الاول ا لهو ايه بتاع ال ايليمنت ال تحت عشانم ياكتف ال اسماءء بتاعه المدن لما تيجي تضغط عليها
      return city.apiName == event.target.value;
    });
    // ال فوق  api request  علي ال  acsess  عشان لما تيجي تضغط علي الاليمنت ال تحت برضو ف نفس الوقت يعمل ايه a الك  selectedCity دا بقا وظيفته انا انتا عملت ال ستيت ال هي اسمها
    setSelectedCity(cityObject);
  };

  // ***********************************************************************************

  return (
    <>
      {/* TOP ROW */}
      <Grid container style={{ background: "green" }}>
        <Grid xs={6}>
          <div>
            {/* تعالي كده نفهم دا جه ازاي 
            
            datacontentprayer : ال من خلاله تقدؤ تجيب اسم الصلاه  key  ده ال فيه ال 
            [nextPrayerIndex] : و ربطه من خلال كوندشن دا من خلاله تقدر انك تقارن مواقيت الصلاه و لو طلع مظبوط بين صلاتين هيجيب ليك اسم ال صلاه  setNextPrayerIndex ال اسمه  state  دا ال نتا من خلاله عملت ال منطق البرمجي من خلال ال 
            name :   key  ال معتمد علي ال datacontentprayer  ال اسمه  object  دي ال موجوده ف ال    
            
            ********* ملحوظه 
            البشمهندس كان عامل اوبجيكت ال هو ده 
            const prayersArray = [
            { key: "Fajr", displayName: "الفجر" },
            { key: "Dhuhr", displayName: "الظهر" },
            { key: "Asr", displayName: "العصر" },
            { key: "Sunset", displayName: "المغرب" },
            { key: "Isha", displayName: "العشاء" },

          key انا بس وفرت ف الكود زودت ف الوبجيكت ال 
            لانه دا ال من خلاله تقدر تعمل تقدر تعمل ال كوندشن 
          ]; 
            */}
            <h1>متبقي حتى صلاة {datacontentprayer[nextPrayerIndex].name}</h1>
            <h2>{remainingTimes}</h2>
          </div>
        </Grid>

        <Grid xs={6}>
          <div>
            <h1>{selectedCity.displayName}</h1>
            <h2>{timetoday}</h2>
          </div>
        </Grid>
      </Grid>
      {/*== TOP ROW ==*/}
      <Divider style={{ borderColor: "white", opacity: "0.1" }} />
      {/* prayer page */}
      <Stack
        direction="row"
        justifyContent="space-around"
        style={{ marginTop: "50px" }}
      >
        {datacontentprayer.map((e) => {
          return <Prayer name={e.name} time={e.time} image={e.image} />;
        })}
      </Stack>

      {/* select city  */}
      <Stack
        direction="row"
        justifyContent={"center"}
        style={{ marginTop: "40px" }}
      >
        <FormControl style={{ width: "20%" }}>
          <InputLabel id="demo-simple-select-label">
            <span style={{ color: "white" }}>المدينة</span>
          </InputLabel>
          <Select
            style={{ color: "white" }}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            // value={age}
            label="Age"
            onChange={handleCityChange}
          >
            {avilableCities.map((city) => {
              return (
                <MenuItem value={city.apiName} key={city.apiName}>
                  {city.displayName}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Stack>
    </>
  );
}
export default Header;
