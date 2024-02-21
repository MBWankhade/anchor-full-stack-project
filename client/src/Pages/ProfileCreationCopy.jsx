import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const initialFormState = {
  name: false,
  mobile: false,
  profilePic: false,
  linkedIn: false,
  github: false,
  resume: false,
  type: false,
  schoolCollegeName: false,
  startDate: false,
  endDate: false,
  projectName: false,
  projectDescription: false,
  soloOrGroup: false,
  projectLink: false,
  internshipJobType: false,
  company: false,
  companyWebsite: false,
  role: false,
  experienceStartDate: false,
  experienceEndDate: false,
  coverLetter: false,
};

const initialFormData = {
  email: localStorage.getItem("email"),
  name: "",
  mobile: "",
  profilePic: null,
  linkedIn: "",
  github: "",
  resume: null,
  type: "school",
  schoolCollegeName: "",
  startDate: "",
  endDate: "",
  projectName: "",
  projectDescription: "",
  soloOrGroup: "solo",
  projectLink: "",
  internshipJobType: "internship",
  company: "",
  companyWebsite: "",
  role: "",
  experienceStartDate: "",
  experienceEndDate: "",
  coverLetter: "",
};

const ProfileCreation = () => {
  const navigate = useNavigate();
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [isValueset, setIsValueSet] = useState(initialFormState);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  const handleFormSubmit = async () => {
    try {
      const backendEndpoint = "http://localhost:3000/new-profile";

      const response = await axios.post(backendEndpoint, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201 || response.status === 200) {
        console.log("Form data submitted successfully!");
        navigate("/");
      } else {
        console.error("Failed to submit form data");
      }
    } catch (error) {
      console.error("Error occurred while submitting form data:", error);
    }
  };

  const handleInputChange = (field, value) => {
    const validationRules = {
      name: { minLength: 5, maxLength: 35 },
      mobile: { minLength: 10, maxLength: 13, isNumeric: true },
      linkedIn: { pattern: /^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/i },
      github: { pattern: /^(https?:\/\/)?(www\.)?github\.com\/.*$/i },
      resume: { fileTypes: ["pdf", "doc", "docx", "jpeg"] },
      type: { minLength: 5 },
      schoolCollegeName: { minLength: 4, maxLength: 100 },
      startDate: {},
      endDate: {},
      projectName: { minLength: 4, maxLength: 50 },
      projectDescription: { minLength: 10, maxLength: 500 },
      soloOrGroup: { minLength: 2 },
      projectLink: { pattern: /^(https?:\/\/)?(www\.)?.*\..*$/i },
      internshipJobType: { minLength: 5 },
      company: { minLength: 5, maxLength: 100 },
      companyWebsite: { pattern: /^(https?:\/\/)?(www\.)?.*\..*$/i },
      role: { minLength: 4, maxLength: 50 },
      experienceStartDate: {},
      experienceEndDate: {},
      coverLetter: { minLength: 20, maxLength: 1000 },
    };

    const isValid = validateField(value, validationRules[field]);

    const coinValues = {
      name: 1,
      mobile: 15,
      profilePic: 5,
      linkedIn: 3,
      github: 5,
      resume: 20,
      type: 5,
      schoolCollegeName: 5,
      startDate: 2,
      endDate: 2,
      projectName: 5,
      projectDescription: 6,
      soloOrGroup: 4,
      projectLink: 10,
      internshipJobType: 5,
      company: 10,
      companyWebsite: 10,
      role: 8,
      experienceStartDate: 2,
      experienceEndDate: 2,
      coverLetter: 20,
      // Add more keys and their corresponding coin values here
    };

    const coinValue = coinValues[field] || 0;

    if (isValid) {
      setFormData((prevData) => ({
        ...prevData,
        [field]: value,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: null,
      }));
      if (!isValueset[field]) {
        setCoinsEarned(coinsEarned + coinValue);
        setIsValueSet((prevState) => ({
          ...prevState,
          [field]: true,
        }));
      }
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: `Invalid ${field}`,
      }));
      if (isValueset[field]) {
        setCoinsEarned(coinsEarned - coinValue);
        setIsValueSet((prevState) => ({
          ...prevState,
          [field]: false,
        }));
      }
    }
  };

  const validateField = (value, rules) => {
    if (!rules) {
      return true; // No rules, consider it valid
    }

    const { minLength, maxLength, isNumeric, pattern, fileTypes } = rules;

    if (minLength && value.length < minLength) {
      return false;
    }

    if (maxLength && value.length > maxLength) {
      return false;
    }

    if (isNumeric && isNaN(value)) {
      return false;
    }

    if (pattern && !pattern.test(value)) {
      return false;
    }

    if (fileTypes && fileTypes.length > 0) {
      const fileType = value.name.split(".").pop().toLowerCase();
      if (!fileTypes.includes(fileType)) {
        return false;
      }
    }

    return true;
  };

  return (
    <div className="p-8 bg-white text-primary">
      <h1 className="text-3xl font-bold mb-6">Profile Creation</h1>
      <div>
        <h2 className="text-xl mb-4">Coins Earned: {coinsEarned}</h2>
      </div>

      {/* Personal Details */}
      <div className="mb-8">
        <h3 className="text-xl mb-4">Personal Details</h3>
        <div className="mb-4">
          <label className="block">Name</label>
          <input
            className={`border p-2 w-full ${
              errors.name ? "border-red-500" : ""
            }`}
            type="text"
            onChange={(e) => handleInputChange("name", e.target.value)}
          />
          {errors.name && <p className="text-red-500">{errors.name}</p>}
        </div>
        {/* ... repeat this pattern for other input fields ... */}
        <div className="mb-4">
          <label className="block">Mobile</label>
          <input
            className="border p-2 w-full"
            type="text"
            onChange={(e) => handleInputChange("mobile", e.target.value)}
          />
          {errors.mobile && <p className="text-red-500">{errors.mobile}</p>}
        </div>
        <div className="mb-4">
          <label className="block">Profile pic</label>
          <input
            className="border p-2 w-full"
            type="file"
            onChange={(e) => handleInputChange("profilePic", e.target.files[0])}
          />
          {errors.profilePic && <p className="text-red-500">{errors.profilePic}</p>}
        </div>
        <div className="mb-4">
          <label className="block">LinkedIn link</label>
          <input
            className="border p-2 w-full"
            type="url"
            pattern="https?://.+"
            onChange={(e) => handleInputChange("linkedIn", e.target.value)}
          />
          {errors.linkedIn && <p className="text-red-500">{errors.linkedIn}</p>}
        </div>
        <div className="mb-4">
          <label className="block">GitHub Link</label>
          <input
            className="border p-2 w-full"
            type="url"
            pattern="https?://.+"
            onChange={(e) => handleInputChange("github", e.target.value)}
          />
          {errors.github && <p className="text-red-500">{errors.github}</p>}
        </div>
        <div className="mb-4">
          <label className="block">Resume (upload)</label>
          <input
            className="border p-2 w-full"
            type="file"
            onChange={(e) => handleInputChange("resume", e.target.files[0])}
          />
          {errors.resume && <p className="text-red-500">{errors.resume}</p>}
        </div>
      </div>

      {/* Education Details */}
      <div className="mb-8">
        <h3 className="text-xl mb-4">Education Details</h3>
        <div className="mb-4">
          <select
            className="border p-2 w-full"
            onChange={(e) => handleInputChange("type", e.target.value)}
          >
            <option value="">Select Type (School/College)</option>
            <option value="school">School</option>
            <option value="college">College</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block">School / College Name</label>
          <input
            className="border p-2 w-full"
            type="text"
            onChange={(e) =>
              handleInputChange("schoolCollegeName", e.target.value)
            }
          />
          {errors.schoolCollegeName && <p className="text-red-500">{errors.schoolCollegeName}</p>}
        </div>
        <div className="mb-4">
          <label className="block">Start Date</label>
          <input
            className="border p-2 w-full"
            type="date"
            onChange={(e) => handleInputChange("startDate", e.target.value)}
            min={formData.startDate || ""}
            max={new Date().toISOString().split("T")[0]}
          />
          {errors.startDate && <p className="text-red-500">{errors.startDate}</p>}
        </div>
        <div className="mb-4">
          <label className="block">End Date</label>
          <input
            className="border p-2 w-full"
            type="date"
            onChange={(e) => handleInputChange("endDate", e.target.value)}
            min={formData.startDate || ""}
            max={new Date().toISOString().split("T")[0]}
          />
          {errors.endDate && <p className="text-red-500">{errors.endDate}</p>}
        </div>
      </div>

      {/* Project Details */}
      <div className="mb-8">
        <h3 className="text-xl mb-4">Project Details</h3>
        <div className="mb-4">
          <label className="block">Project Name</label>
          <input
            className="border p-2 w-full"
            type="text"
            onChange={(e) => handleInputChange("projectName", e.target.value)}
          />
          {errors.projectName && <p className="text-red-500">{errors.projectName}</p>}
        </div>
        <div className="mb-4">
          <label className="block">Project Description</label>
          <input
            className="border p-2 w-full"
            type="text"
            onChange={(e) =>
              handleInputChange("projectDescription", e.target.value)
            }
          />
          {errors.projectDescription && <p className="text-red-500">{errors.projectDescription}</p>}
        </div>
        <div className="mb-4">
          <select
            className="border p-2 w-full"
            onChange={(e) => handleInputChange("soloOrGroup", e.target.value)}
          >
            <option value="">Select Solo Project / Group Project</option>
            <option value="solo">Solo Project</option>
            <option value="group">Group Project</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block">Project Link</label>
          <input
            className="border p-2 w-full"
            type="url"
            onChange={(e) => handleInputChange("projectLink", e.target.value)}
          />
          {errors.projectLink && <p className="text-red-500">{errors.projectLink}</p>}
        </div>
      </div>

      {/* Past Experience Details */}
      <div className="mb-8">
        <h3 className="text-xl mb-4">Past Experience Details</h3>
        <div className="mb-4">
          <select
            className="border p-2 w-full"
            onChange={(e) =>
              handleInputChange("internshipJobType", e.target.value)
            }
          >
            <option value="">Select Type (Internship/Job)</option>
            <option value="internship">Internship</option>
            <option value="job">Job</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block">Company Name</label>
          <input
            className="border p-2 w-full"
            type="text"
            onChange={(e) => handleInputChange("company", e.target.value)}
          />
          {errors.company && <p className="text-red-500">{errors.company}</p>}
        </div>
        <div className="mb-4">
          <label className="block">Company Website link</label>
          <input
            className="border p-2 w-full"
            type="url"
            pattern="https?://.+"
            onChange={(e) =>
              handleInputChange("companyWebsite", e.target.value)
            }
          />
          {errors.companyWebsite && <p className="text-red-500">{errors.companyWebsite}</p>}
        </div>
        <div className="mb-4">
          <label className="block">Role</label>
          <input
            className="border p-2 w-full"
            type="text"
            onChange={(e) => handleInputChange("role", e.target.value)}
          />
          {errors.role && <p className="text-red-500">{errors.role}</p>}
        </div>
        <div className="mb-4">
          <label className="block">Start Date</label>
          <input
            className="border p-2 w-full"
            type="date"
            onChange={(e) =>
              handleInputChange("experienceStartDate", e.target.value)
            }
            min={formData.startDate || ""}
            max={new Date().toISOString().split("T")[0]}
          />
          {errors.experienceStartDate && <p className="text-red-500">{errors.experienceStartDate}</p>}
        </div>
        <div className="mb-4">
          <label className="block">End Date</label>
          <input
            className="border p-2 w-full"
            type="date"
            onChange={(e) =>
              handleInputChange("experienceEndDate", e.target.value)
            }
            min={formData.startDate || ""}
            max={new Date().toISOString().split("T")[0]}
          />
          {errors.experienceEndDate && <p className="text-red-500">{errors.experienceEndDate}</p>}
        </div>
        <div className="mb-4">
          <label className="block">Cover letter</label>
          <input
            className="border p-2 w-full"
            type="text"
            onChange={(e) => handleInputChange("coverLetter", e.target.value)}
          />
          {errors.coverLetter && <p className="text-red-500">{errors.coverLetter}</p>}
        </div>
      </div>

      <div>
        <button
          className="bg-blue text-white py-2 px-4 rounded"
          onClick={handleFormSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ProfileCreation;
