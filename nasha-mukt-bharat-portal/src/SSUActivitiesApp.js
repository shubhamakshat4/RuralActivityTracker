import { useEffect, useState, useContext } from "react";
import "./App.css";
import { uploadImage, uploadVideo } from "./cloudinary";
import { LanguageContext } from "./context/LanguageContext";
import Header from "./components/Header";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

// -----------------------------------------------------------------------------------------
// Google Apps Script Web App URL bound to the Sri Sri University Activities Spreadsheet:
// https://docs.google.com/spreadsheets/d/1RgY8hXTIg6-f0pRoCOSzT4uOyfPmfkA9REmLJEXHAAI/edit
// -----------------------------------------------------------------------------------------
const SSU_ACTIVITIES_WEB_APP_URL =
  process.env.REACT_APP_SSU_WEB_APP_URL ||
  "https://script.google.com/macros/s/AKfycbzPqG4O9vjNZKpDlurDPZex7bOIb8fm2T-F8Pa3fKOLuU0LT3BSCuzWnzpM7ZeAbEYc/exec";

const customSelectStyles = {
  control: (base, state) => ({
    ...base,
    background: "rgba(255, 255, 255, 0.20)",
    borderColor: state.isFocused ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.4)",
    borderRadius: "12px",
    padding: "4px",
    color: "#ffffff",
    boxShadow: state.isFocused ? "0 0 10px rgba(255, 255, 255, 0.5)" : "none",
    "&:hover": {
      borderColor: "rgba(255, 255, 255, 0.6)"
    }
  }),
  singleValue: (base) => ({
    ...base,
    color: "#ffffff",
    fontWeight: "500"
  }),
  input: (base) => ({
    ...base,
    color: "#ffffff"
  }),
  placeholder: (base) => ({
    ...base,
    color: "rgba(255, 255, 255, 0.7)"
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.35)",
    zIndex: 9999
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#4A0E17"
      : state.isFocused
      ? "#fce7f3"
      : "#ffffff",
    color: state.isSelected ? "#ffffff" : state.isFocused ? "#4A0E17" : "#1e293b",
    cursor: "pointer",
    fontWeight: state.isSelected ? "600" : "400",
    "&:active": {
      backgroundColor: "#4A0E17",
      color: "#ffffff"
    }
  })
};

export default function SSUActivitiesApp() {
  /* LGD DATA */
  const [lgd, setLgd] = useState({});
  const [districts, setDistricts] = useState([]);
  const [subdistricts, setSubdistricts] = useState([]);
  const [villages, setVillages] = useState([]);
  const [success, setSuccess] = useState(false);
  const { t } = useContext(LanguageContext);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  /* SELECTED LOCATION */
  const [districtName, setDistrictName] = useState("");
  const [districtCode, setDistrictCode] = useState("");

  const [subdistrictName, setSubdistrictName] = useState("");
  const [subdistrictCode, setSubdistrictCode] = useState("");

  const [villageName, setVillageName] = useState("");
  const [villageCode, setVillageCode] = useState("");

  const [manualVillage, setManualVillage] = useState(false);
  const [manualVillageName, setManualVillageName] = useState("");

  const programDefaults = {
    "Capacity Building Leadership Programs": { days: 1, hours: 4 },
    "Happiness Program": { days: 5, hours: 3 },
    "Sahaj Samadhi Dhyan Program": { days: 3, hours: 2 },
    "Advanced Meditation Program": { days: 4, hours: 4 },
    "Government Programs": { days: 1, hours: 3 },
    "Teacher Reunion Program": { days: 1, hours: 3 },
    "Seminar": { days: 1, hours: 3 },
    "Rally": { days: 1, hours: 3 },
    "Counselling": { days: 1, hours: 3 },
    "Satsang": { days: 1, hours: 2 },
    "Program with Pujya Gurudev": { days: 1, hours: 3 },
    "Village Committee member Meeting": { days: 1, hours: 2 },
    "Village Youth Meet": { days: 1, hours: 2 }
  };

  /* FORM */
  const [form, setForm] = useState({
    name: user?.name || "",
    mobile: user?.mobile || "",
    startDate: "",
    endDate: "",
    hoursPerDay: ""
  });
  const [errors, setErrors] = useState({});

  /* MEDIA */
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);

  const [photoPreview, setPhotoPreview] = useState([]);
  const [videoPreview, setVideoPreview] = useState([]);

  /* UI */
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");

  const districtOptions = districts.map((d) => ({ label: d, value: d }));
  const subdistrictOptions = subdistricts.map((s) => ({ label: s, value: s }));
  const villageOptions = villages.map((v) => ({ label: v, value: v }));

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
  useEffect(() => {
    fetch("/lgd.json")
      .then((res) => res.json())
      .then((data) => {
        setLgd(data);
        setDistricts(Object.keys(data));
      });
  }, []);

  /* UPDATE FORM */
  const update = (k, v) => {
    setForm((prev) => ({ ...prev, [k]: v }));
  };

  const autoPopulateDates = (program, startDate) => {
    if (!program || !startDate) return;
    const config = programDefaults[program];
    if (!config) return;

    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + config.days - 1);
    const formattedEnd = end.toISOString().split("T")[0];

    setForm((prev) => ({
      ...prev,
      endDate: formattedEnd,
      hoursPerDay: config.hours
    }));
  };

  const calculateTotalHours = () => {
    if (!form.startDate || !form.endDate || !form.hoursPerDay) return 0;
    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    const days = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
    return days * Number(form.hoursPerDay);
  };

  const totalHours = calculateTotalHours();

  /* LOCATION HANDLERS */
  const handleDistrict = (district) => {
    setDistrictName(district);
    setDistrictCode(lgd[district].code);
    setSubdistricts(Object.keys(lgd[district].subdistricts));
    setSubdistrictName("");
    setVillageName("");
    setManualVillage(false);
  };

  const handleSubdistrict = (subdistrict) => {
    setSubdistrictName(subdistrict);
    setSubdistrictCode(lgd[districtName].subdistricts[subdistrict].code);
    setVillages(Object.keys(lgd[districtName].subdistricts[subdistrict].villages));
    setVillageName("");
    setManualVillage(false);
  };

  const handleVillage = (village) => {
    setVillageName(village);
    setVillageCode(lgd[districtName].subdistricts[subdistrictName].villages[village].code);
    setManualVillage(false);
  };

  /* VALIDATION */
  const validate = () => {
    let e = {};
    if (!form.name) e.name = true;
    if (!form.mobile || !/^[6-9]\d{9}$/.test(form.mobile)) e.mobile = true;
    if (!form.program) e.program = true;
    if (!form.description) e.description = true;
    if (!form.attendance) e.attendance = true;
    if (!districtCode) e.district = true;
    if (!form.startDate) e.startDate = true;
    if (!form.endDate) e.endDate = true;
    if (!form.hoursPerDay) e.hoursPerDay = true;
    if (form.startDate && form.endDate && new Date(form.endDate) < new Date(form.startDate)) {
      e.endDate = true;
    }
    if (!subdistrictCode) e.subdistrict = true;
    if (!villageCode && !manualVillageName) e.village = true;

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* SUBMIT */
  const submit = async () => {
    if (!validate()) {
      alert(t.fillAll);
      return;
    }

    setLoading(true);

    try {
      /* PHOTO UPLOAD */
      let photoUrls = [];
      for (let file of photos) {
        setLoadingText("Uploading Photo");
        const url = await uploadImage(file, (p) => setLoadingText(`Photo ${p}%`));
        photoUrls.push(url);
      }

      /* VIDEO UPLOAD */
      let videoUrls = [];
      for (let file of videos) {
        setLoadingText("Uploading Video");
        const url = await uploadVideo(file, (p) => setLoadingText(`Video ${p}%`));
        videoUrls.push(url);
      }

      /* SAVE */
      setLoadingText("Saving Report");
      const url = new URL(SSU_ACTIVITIES_WEB_APP_URL);

      url.searchParams.append("name", form.name);
      url.searchParams.append("mobile", form.mobile);
      url.searchParams.append("attendance", form.attendance);
      url.searchParams.append("program", form.program);
      url.searchParams.append("programStartDate", form.startDate);
      url.searchParams.append("programEndDate", form.endDate);
      url.searchParams.append("hoursPerDay", form.hoursPerDay);
      url.searchParams.append("totalHours", totalHours);
      url.searchParams.append("stateName", "Odisha");
      url.searchParams.append("stateCode", "21");
      url.searchParams.append("districtName", districtName);
      url.searchParams.append("districtCode", districtCode);
      url.searchParams.append("subdistrictName", subdistrictName);
      url.searchParams.append("subdistrictCode", subdistrictCode);
      url.searchParams.append("villageName", manualVillageName ? manualVillageName : villageName);
      url.searchParams.append("villageCode", manualVillageName ? "" : villageCode);
      url.searchParams.append("description", form.description);
      url.searchParams.append("photos", photoUrls.join(", "));
      url.searchParams.append("videos", videoUrls.join(", "));

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to save to Google Sheet");
      }

      setSuccess(true);
    } catch (err) {
      alert(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="ssuTheme">
      {/* HEADER */}
      <Header
        title="Social Outreach - Sri Sri University"
        subtitle="Sri Sri University Activities Module"
      />

      {/* SUCCESS POPUP */}
      {success && (
        <div className="successPopup">
          <div className="successBox">
            <h2>🎉 Congratulations!</h2>
            <p>{t.success}</p>
            <button
              onClick={() => {
                setSuccess(false);
                window.location.reload();
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* LOADER */}
      {loading && (
        <div className="loader">
          <div className="spinner" />
          <p>{loadingText}</p>
        </div>
      )}

      {/* USER DETAILS */}
      <div className="card glass">
        <h2>{t.userDetails}</h2>
        <div className="field">
          <input placeholder=" " value={form.name} readOnly />
          <label>{t.name} *</label>
        </div>
        <div className="field">
          <input placeholder=" " value={form.mobile} readOnly />
          <label>{t.mobile} *</label>
        </div>
      </div>

      {/* EVENT DETAILS */}
      <div className="card glass">
        <h2>{t.ssuActivitiesModule || "Sri Sri University Activities Module"}</h2>

        <div className="field">
          <select
            value={form.program || ""}
            onChange={(e) => {
              const selectedProgram = e.target.value;
              update("program", selectedProgram);
              autoPopulateDates(selectedProgram, form.startDate);
            }}
            className={form.program ? "hasValue" : ""}
          >
            <option value="" disabled hidden>
              {t.selectProgram}
            </option>
            <option value="Capacity Building Leadership Programs">
              {t.capacityBuilding || "Capacity Building Leadership Programs"}
            </option>
            <option value="Happiness Program">{t.happinessProgram || "Happiness Program"}</option>
            <option value="Sahaj Samadhi Dhyan Program">
              {t.sahajSamadhi || "Sahaj Samadhi Dhyan Program"}
            </option>
            <option value="Advanced Meditation Program">
              {t.advancedMeditation || "Advanced Meditation Program"}
            </option>
            <option value="Government Programs">{t.govtPrograms || "Government Programs"}</option>
            <option value="Teacher Reunion Program">
              {t.teacherReunion || "Teacher Reunion Program"}
            </option>
            <option value="Seminar">{t.seminar || "Seminar"}</option>
            <option value="Rally">{t.rally || "Rally"}</option>
            <option value="Counselling">{t.counselling || "Counselling"}</option>
            <option value="Satsang">{t.satsang || "Satsang"}</option>
            <option value="Program with Pujya Gurudev">
              {t.programWithGurudev || "Program with Pujya Gurudev"}
            </option>
            <option value="Village Committee member Meeting">
              {t.villageCommitteeMeeting || "Village Committee member Meeting"}
            </option>
            <option value="Village Youth Meet">
              {t.villageYouthMeet || "Village Youth Meet"}
            </option>
            <option value="Others">{t.others || "Others"}</option>
          </select>

          <label>{t.program} *</label>
        </div>

        <div className="field">
          <textarea placeholder=" " onChange={(e) => update("description", e.target.value)} />
          <label>{t.description} *</label>
        </div>

        <div className="field">
          <input type="number" placeholder=" " onChange={(e) => update("attendance", e.target.value)} />
          <label>{t.attendance} *</label>
        </div>

        <div className="field">
          <input
            type="date"
            placeholder=" "
            required
            onChange={(e) => {
              const selectedDate = e.target.value;
              update("startDate", selectedDate);
              autoPopulateDates(form.program, selectedDate);
            }}
          />
          <label>{t.startDate} *</label>
        </div>

        <div className="field">
          <input
            type="date"
            value={form.endDate || ""}
            onChange={(e) => update("endDate", e.target.value)}
          />
          <label>{t.endDate} *</label>
        </div>

        <div className="field">
          <input
            type="number"
            min="1"
            value={form.hoursPerDay || ""}
            onChange={(e) => update("hoursPerDay", e.target.value)}
          />
          <label>{t.hoursPerDay} *</label>
        </div>

        <h3 className="section">{t.location}</h3>

        {/* DISTRICT */}
        <div className="field selectField">
          <label>{t.district} *</label>
          <Select
            options={districtOptions}
            value={districtName ? { label: districtName, value: districtName } : null}
            onChange={(opt) => handleDistrict(opt.value)}
            placeholder="Search District..."
            isSearchable
            styles={customSelectStyles}
          />
        </div>

        {/* SUBDISTRICT */}
        {districtName && (
          <div className="field selectField">
            <label>{t.subdistrict} *</label>
            <Select
              options={subdistrictOptions}
              value={subdistrictName ? { label: subdistrictName, value: subdistrictName } : null}
              onChange={(opt) => handleSubdistrict(opt.value)}
              placeholder="Search Subdistrict..."
              isSearchable
              styles={customSelectStyles}
            />
          </div>
        )}

        {/* VILLAGE */}
        {subdistrictName && !manualVillage && (
          <div className="field selectField">
            <label>{t.village} *</label>
            <Select
              options={villageOptions}
              value={villageName ? { label: villageName, value: villageName } : null}
              onChange={(opt) => handleVillage(opt.value)}
              placeholder="Search Village..."
              isSearchable
              styles={customSelectStyles}
            />
          </div>
        )}

        {subdistrictName && (
          <div className="manualCheck">
            <label>
              <input
                type="checkbox"
                checked={manualVillage}
                onChange={(e) => {
                  setManualVillage(e.target.checked);
                  setVillageName("");
                  setVillageCode("");
                }}
              />
              {t.villageNotFound}
            </label>
          </div>
        )}

        {manualVillage && (
          <div className="field">
            <input
              placeholder=" "
              value={manualVillageName}
              onChange={(e) => setManualVillageName(e.target.value)}
            />
            <label>{t.enterVillage} *</label>
          </div>
        )}

        {/* MEDIA */}
        <div className="field mediaUpload">
          <p>{t.uploadPhotos} (Max 50MB per photo)</p>
          <label className="customFileBtn">
            📸 Choose Photos
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                const files = Array.from(e.target.files);
                const previews = files.map((file) => ({
                  name: file.name,
                  url: URL.createObjectURL(file)
                }));
                setPhotos((prev) => [...prev, ...files]);
                setPhotoPreview((prev) => [...prev, ...previews]);
              }}
            />
          </label>
        </div>

        {photoPreview.length > 0 && (
          <div className="previewBox">
            {photoPreview.map((file, index) => (
              <div key={index} className="previewItem">
                <img src={file.url} alt="preview" />
                <p>{file.name}</p>
                <button className="removeBtn" onClick={() => removePhoto(index)}>
                  ✖
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="field mediaUpload">
          <p>{t.uploadVideos}</p>
          <label className="customFileBtn">
            🎥 Choose Videos
            <input
              type="file"
              multiple
              accept="video/*"
              onChange={(e) => {
                const files = Array.from(e.target.files);
                const previews = files.map((file) => ({
                  name: file.name,
                  url: URL.createObjectURL(file)
                }));
                setVideos((prev) => [...prev, ...files]);
                setVideoPreview((prev) => [...prev, ...previews]);
              }}
            />
          </label>
        </div>

        {videoPreview.length > 0 && (
          <div className="previewBox">
            {videoPreview.map((file, index) => (
              <div key={index} className="videoItem">
                🎥 {file.name}
                <button className="removeBtn" onClick={() => removeVideo(index)}>
                  ✖
                </button>
              </div>
            ))}
          </div>
        )}

        <button className="submitBtn" onClick={submit}>
          {t.submit}
        </button>
      </div>
    </div>
  );
}
