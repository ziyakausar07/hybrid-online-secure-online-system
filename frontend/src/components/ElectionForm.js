import { useEffect,useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../apiConfig";

const ElectionForm = () => {
    const [formData, setFormData] = useState({
        usn: "",
        name: "",
        email: "",
        college: "",
        division: "",
        department: "",
        branch: "",
        semester: "",
        position: "",
    });
    useEffect(() => {
        document.body.style.background =
          "radial-gradient(circle at 20% 30%, #FFD1DC, #FFDFD3, transparent 60%), radial-gradient(circle at 80% 70%, #B3E5FC, #E6E6FA, transparent 60%), linear-gradient(180deg, #B5EAD7, #FFDFD3)";
        document.body.style.display = "flex";
        document.body.style.justifyContent = "center";
        document.body.style.alignItems = "center";
        document.documentElement.style.height = "100%"; 
        document.body.style.minHeight = "136vh"; // Full height extend karega
        document.body.style.overflow = "auto"; 
        document.body.style.margin = "0";
    
        return () => {
          document.body.style.background = "";
          document.body.style.display = "";
          document.body.style.justifyContent = "";
          document.body.style.alignItems = "";
          document.documentElement.style.height = "";
          document.body.style.minHeight = "";
          document.body.style.overflow = "";
          document.body.style.margin = "";
        };
      }, []);

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form Data Sending:", formData);  // ✅ Debugging ke liye
    
        try {
            const response = await axios.post(`${API_BASE_URL}/api/participate`, formData);
            setMessage(response.data.message);
    
            // ✅ Success Message Alert
            alert("✅ Success: " + response.data.message);
        } catch (error) {
            const errorMsg = "❌ Error: " + (error.response?.data?.error || "Failed to submit");
            setMessage(errorMsg);
    
            // ❌ Error Message Alert
            alert(errorMsg);
        }
    };
    
    

    return (
        <div className="profile-container"
    style={{
      top: "0%",
      left: "0%",
      alignItems: "center",
      height: "30%",
      width: "100%",
      bottom: "30%",
      right: "0%",
      background:
        "radial-gradient(circle at top left, #1e3c72, #2a5298, transparent 50%), radial-gradient(circle at bottom right, #ff758c, #ff7eb3, transparent 50%), linear-gradient(135deg, #141e30, #243b55)",
      textAlign: "left",
      position: "relative",
      zIndex: 9999,
    }}>
            <h2>Election Participation Form</h2>
            <form className="profile-details" onSubmit={handleSubmit}>
        <label>USN</label> <input type="text" name="usn" value={formData.usn} onChange={handleChange} required />
        <label>Name</label> <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        <label>Email</label> <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        <label>College</label> <input type="text" name="college" value={formData.college} onChange={handleChange} required />
        <label>Division</label> <input type="text" name="division" value={formData.division} onChange={handleChange} required />
        <label>Department</label> <input type="text" name="department" value={formData.department} onChange={handleChange} required />
        <label>Branch</label> <input type="text" name="branch" value={formData.branch} onChange={handleChange} required />
        <label>Semester</label> <input type="text" name="semester" value={formData.semester} onChange={handleChange} required />
        <label>Position Applying For</label>
        <select name="position" value={formData.position} onChange={handleChange} required>
            <option value="">Select Position</option>
            <option value="Class Representative">Class Representative</option>
            <option value="Ladies Representative">Ladies Representative</option>
            <option value="President">President</option>
            <option value="Vice President">Vice President</option>
            <option value="Secretary">Secretary</option>
            <option value="Treasurer">Treasurer</option>
        </select>
  
    {message && <p style={{ marginTop: "10px", color: message.startsWith("❌") ? "#ff4d4f" : "#52c41a" }}>{message}</p>}
    <button type="submit" className="save-btn">Submit</button>
</form>

        </div>
    );
};

export default ElectionForm;
