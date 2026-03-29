import { useEffect, useState } from "react";
import "./App.css";
import { uploadImage, uploadVideo } from "./cloudinary";
import { useContext } from "react";
import { LanguageContext } from "./context/LanguageContext";
import LanguageSelector from "./components/LanguageSelector";
import Header from "./components/Header";
import Select from "react-select";




export default function MainApp(){

/* LGD DATA */

const [lgd,setLgd]=useState({});
const [districts,setDistricts]=useState([]);
const [subdistricts,setSubdistricts]=useState([]);
const [villages,setVillages]=useState([]);
const [success,setSuccess]=useState(false);
const { t } = useContext(LanguageContext);




/* SELECTED LOCATION */

const [districtName,setDistrictName]=useState("");
const [districtCode,setDistrictCode]=useState("");

const [subdistrictName,setSubdistrictName]=useState("");
const [subdistrictCode,setSubdistrictCode]=useState("");

const [villageName,setVillageName]=useState("");
const [villageCode,setVillageCode]=useState("");

const [manualVillage,setManualVillage]=useState(false);
const [manualVillageName,setManualVillageName]=useState("");


/* FORM */

const [form,setForm]=useState({venue:"",date:""});
const [errors,setErrors]=useState({});


/* MEDIA */

const [photos,setPhotos]=useState([]);
const [videos,setVideos]=useState([]);

const [photoPreview,setPhotoPreview]=useState([]);
const [videoPreview,setVideoPreview]=useState([]);


/* UI */

const [loading,setLoading]=useState(false);
const [loadingText,setLoadingText]=useState("");

const districtOptions = districts.map(d => ({
  label: d,
  value: d
}));
const subdistrictOptions = subdistricts.map(s => ({
  label: s,
  value: s
}));
const villageOptions = villages.map(v => ({
  label: v,
  value: v
}));
const removePhoto = (index) => {
  const updatedPhotos = [...photos];
  const updatedPreview = [...photoPreview];

  updatedPhotos.splice(index, 1);
  updatedPreview.splice(index, 1);

  setPhotos(updatedPhotos);
  setPhotoPreview(updatedPreview);
};
const removeVideo = (index) => {
  const updatedVideos = [...videos];
  const updatedPreview = [...videoPreview];

  updatedVideos.splice(index, 1);
  updatedPreview.splice(index, 1);

  setVideos(updatedVideos);
  setVideoPreview(updatedPreview);
};


/* LOAD LGD */

useEffect(()=>{

fetch("/lgd.json")
.then(res=>res.json())
.then(data=>{

setLgd(data);
setDistricts(Object.keys(data));

});

},[]);



/* UPDATE FORM */

const update=(k,v)=>{

setForm(prev=>({...prev,[k]:v}));

};



/* DISTRICT */

const handleDistrict=(district)=>{

setDistrictName(district);
setDistrictCode(lgd[district].code);

setSubdistricts(
Object.keys(lgd[district].subdistricts)
);

/* reset lower */

setSubdistrictName("");
setVillageName("");

setManualVillage(false);

};



/* SUBDISTRICT */

const handleSubdistrict=(subdistrict)=>{

setSubdistrictName(subdistrict);

setSubdistrictCode(
lgd[districtName]
.subdistricts[subdistrict].code
);

setVillages(

Object.keys(
lgd[districtName]
.subdistricts[subdistrict]
.villages
)

);

/* reset village */

setVillageName("");
setManualVillage(false);

};



/* VILLAGE */

const handleVillage=(village)=>{

setVillageName(village);

setVillageCode(

lgd[districtName]
.subdistricts[subdistrictName]
.villages[village].code

);

setManualVillage(false);

};



/* VALIDATION */

const validate=()=>{

let e={};

if(!form.name) e.name=true;

if(!form.mobile ||
!/^[6-9]\d{9}$/.test(form.mobile))
e.mobile=true;

if(!form.program) e.program=true;

if(!form.description) e.description=true;

if(!form.attendance) e.attendance=true;

if(!districtCode) e.district=true;
if(!form.date) e.date=true;

if(!subdistrictCode) e.subdistrict=true;

if(!villageCode && !manualVillageName)
e.village=true;

setErrors(e);

return Object.keys(e).length===0;

};



/* SUBMIT */

const submit=async()=>{

if(!validate()){

alert(t.fillAll);

return;

}

setLoading(true);

try{


/* PHOTO UPLOAD */

let photoUrls=[];

for(let file of photos){

setLoadingText("Uploading Photo");

const url=await uploadImage(
file,
(p)=>setLoadingText(`Photo ${p}%`)
);

photoUrls.push(url);

}

{photoPreview.length>0 &&

<div className="previewBox">

{photoPreview.map((file,index)=>

<div key={index} className="previewItem">

<img src={file.url}/>

<p>{file.name}</p>

</div>

)}

</div>

}



/* VIDEO UPLOAD */

let videoUrls=[];

for(let file of videos){

setLoadingText("Uploading Video");

const url=await uploadVideo(
file,
(p)=>setLoadingText(`Video ${p}%`)
);

videoUrls.push(url);

}

{videoPreview.length>0 &&

<div className="previewBox">

{videoPreview.map((file,index)=>

<div key={index} className="videoItem">

🎥 {file.name}

</div>

)}

</div>

}


/* SAVE */

setLoadingText("Saving Report");


const url = new URL("https://script.google.com/macros/s/AKfycbyZT-7398x1_y6oslxgeeC4AHrFmsFXU4ca0iw_zAANLm0oMvQAiteYZXRaWr3p_VCq/exec");

url.searchParams.append("name", form.name);
url.searchParams.append("mobile", form.mobile);
url.searchParams.append("attendance", form.attendance);
url.searchParams.append("program", form.program);
url.searchParams.append("programDate", form.date);
url.searchParams.append("date", form.date);
url.searchParams.append("stateName", "Odisha");
url.searchParams.append("stateCode", "21");
url.searchParams.append("districtName", districtName);
url.searchParams.append("districtCode", districtCode);
url.searchParams.append("subdistrictName", subdistrictName);
url.searchParams.append("subdistrictCode", subdistrictCode);
url.searchParams.append("villageName", manualVillageName ? manualVillageName : villageName);
url.searchParams.append("villageCode", manualVillageName ? "" : villageCode);
url.searchParams.append("venue", form.venue);
url.searchParams.append("description", form.description);
url.searchParams.append("photos", photoUrls.join(", "));
url.searchParams.append("videos", videoUrls.join(", "));
console.log(url.toString());

const res = await fetch(url);

if (!res.ok) {
  throw new Error("Failed to save to Google Sheet");
}

setSuccess(true);   // ✅ simple GET request


}catch(err){

alert(err.message);

}

setLoading(false);

};



/* UI */

return(

<div className="bg">


{/* HEADER */}

<Header/>


{/* SUCCESS POPUP */}

{success &&

<div className="successPopup">

<div className="successBox">

<h2>🎉 Congratulations!</h2>

<p>{t.success}</p>

<button onClick={()=>{

setSuccess(false);
window.location.reload();

}}>

OK

</button>

</div>

</div>

}



{/* LOADER */}

{loading &&

<div className="loader">

<div className="spinner"/>

<p>{loadingText}</p>

</div>

}



{/* USER DETAILS */}

<div className="card glass">

<h2>{t.userDetails}</h2>

<div className="field">

<input
placeholder=" "
onChange={e=>update("name",e.target.value)}
/>

<label>{t.name} *</label>


</div>



<div className="field">

<input
placeholder=" "
onChange={e=>update("mobile",e.target.value)}
/>

<label>{t.mobile} *</label>

</div>


</div>




{/* EVENT DETAILS */}

<div className="card glass">

<h2>{t.eventDetails}</h2>

<div className="field">

<select
value={form.program || ""}
onChange={e=>update("program",e.target.value)}
className={form.program ? "hasValue" : ""}
>

<option value="" disabled hidden>
{t.selectProgram}
</option>

<option value="seminar">{t.seminar}</option>
<option value="rally">{t.rally}</option>
<option value="nukkad">{t.nukkad}</option>
<option value="satsang">{t.satsang}</option>
<option value="competition">{t.competition}</option>
<option value="counselling">{t.counselling}</option>
<option value="others">{t.others}</option>

</select>

<label>{t.program} *</label>

</div>


<div className="field">

<textarea
placeholder=" "
onChange={e=>update("description",e.target.value)}
/>

<label>{t.description} *</label>

</div>

<div className="field">

<input
type="number"
placeholder=" "
onChange={e=>update("attendance",e.target.value)}
/>

<label>{t.attendance} *</label>

</div>


<div className="field">

<input
type="date"
placeholder=" "
required
onChange={e=>update("date",e.target.value)}
/>

<label>{t.date} *</label>

</div>

<h3 className="section">{t.location}</h3>

{/* DISTRICT */}

<div className="field">
    <label>{t.district} *</label>

<Select
  options={districtOptions}
  onChange={(selected) => handleDistrict(selected.value)}
  placeholder={t.district}
  isClearable
  styles={{
    control: (base) => ({
      ...base,
      backgroundColor: "#fff",
      borderRadius: "8px"
    }),
    singleValue: (base) => ({
      ...base,
      color: "#000"
    }),
    input: (base) => ({
      ...base,
      color: "#000"
    }),
    placeholder: (base) => ({
      ...base,
      color: "#888"
    }),

    // 🔥 ADD THESE (IMPORTANT)
    menu: (base) => ({
      ...base,
      backgroundColor: "#fff",
      zIndex: 9999
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#2f80ed"
        : state.isFocused
        ? "#e6f0ff"
        : "#fff",
      color: state.isSelected ? "#fff" : "#000",
      cursor: "pointer"
    })
  }}
/>



</div>


{/* SUBDISTRICT */}

<div className="field">
    <label>{t.subdistrict} *</label>

<Select
  options={subdistrictOptions}
  onChange={(selected) => handleSubdistrict(selected.value)}
  placeholder={t.subdistrict}
  isClearable
  styles={{
    control: (base) => ({
      ...base,
      backgroundColor: "#fff",
      borderRadius: "8px"
    }),
    singleValue: (base) => ({
      ...base,
      color: "#000"
    }),
    input: (base) => ({
      ...base,
      color: "#000"
    }),
    placeholder: (base) => ({
      ...base,
      color: "#888"
    }),

    // 🔥 ADD THESE (IMPORTANT)
    menu: (base) => ({
      ...base,
      backgroundColor: "#fff",
      zIndex: 9999
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#2f80ed"
        : state.isFocused
        ? "#e6f0ff"
        : "#fff",
      color: state.isSelected ? "#fff" : "#000",
      cursor: "pointer"
    })
  }}
/>



</div>


{/* VILLAGE */}

<div className="field">

<label>{t.village} *</label>

<Select
  options={villageOptions}
  onChange={(selected) => handleVillage(selected.value)}
  placeholder={t.village}
  isClearable
   styles={{
    control: (base) => ({
      ...base,
      backgroundColor: "#fff",
      borderRadius: "8px"
    }),
    singleValue: (base) => ({
      ...base,
      color: "#000"
    }),
    input: (base) => ({
      ...base,
      color: "#000"
    }),
    placeholder: (base) => ({
      ...base,
      color: "#888"
    }),

    // 🔥 ADD THESE (IMPORTANT)
    menu: (base) => ({
      ...base,
      backgroundColor: "#fff",
      zIndex: 9999
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#2f80ed"
        : state.isFocused
        ? "#e6f0ff"
        : "#fff",
      color: state.isSelected ? "#fff" : "#000",
      cursor: "pointer"
    })
  }}
/>



</div>

{/* MANUAL VILLAGE BUTTON */}

<button
type="button"
className="link"
onClick={()=>setManualVillage(true)}
>

{t.villageNotFound}

</button>


{/* MANUAL INPUT */}

{manualVillage &&

<div className="field">

<input
placeholder=" "
onChange={e=>setManualVillageName(e.target.value)}
/>

<label>{t.enterVillage}</label>


</div>

}
<div className="field">

<input
placeholder=" "
onChange={e=>update("venue",e.target.value)}
/>

<label>{t.venue}</label>

</div>




{/* PHOTO */}

<label className="upload">

📷 {t.uploadPhotos}

<input
type="file"
hidden
multiple

onChange={e=>{

const valid=[];
const preview=[];

for(let file of e.target.files){

valid.push(file);

preview.push({

name:file.name,
url:URL.createObjectURL(file),
size:(file.size/1024/1024).toFixed(1)+" MB"

});

}

setPhotos(valid);
setPhotoPreview(preview);

}}

/>

</label>

{photoPreview.length>0 && (

<div className="previewBox">

{photoPreview.map((file,index)=>(

<div key={index} className="previewItem">
    <button
          className="removeBtn"
          onClick={() => removePhoto(index)}
        >
          ✖
        </button>

<img src={file.url} />

<p>{file.name}</p>

<small>{file.size}</small>

</div>

))}

</div>

)}


{/* VIDEO */}

<label className="upload">

🎥 {t.uploadVideos}


<input
type="file"
hidden
multiple

onChange={e=>{

const valid=[];
const preview=[];

for(let file of e.target.files){

valid.push(file);

preview.push({

name:file.name,
size:(file.size/1024/1024).toFixed(1)+" MB"

});

}

setVideos(valid);
setVideoPreview(preview);

}}


/>

</label>

{videoPreview.length>0 && (

<div className="previewBox">

{videoPreview.map((file,index)=>(

<div key={index} className="videoItem">
    <button
          className="removeBtn"
          onClick={() => removeVideo(index)}
        >
          ✖
        </button>

🎥 {file.name}

<br/>

<small>{file.size}</small>

</div>

))}

</div>

)}



{/* SUBMIT */}

<button
className="submit"
onClick={submit}
disabled={loading}
>

{t.submit}

</button>



</div>


</div>

);
}
