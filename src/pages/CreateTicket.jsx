import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles.css";

const MAX_PHOTOS = 2;
const MAX_FILE_SIZE = 1 * 1024 * 1024;
const MAX_DESCRIPTION = 300;

function readImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({
      name: file.name,
      type: file.type,
      url: reader.result,
    });
    reader.onerror = () => reject(new Error("Could not read the selected image."));
    reader.readAsDataURL(file);
  });
}

function CreateTicket({ tickets, setTickets }) {
  const navigate = useNavigate();

  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Technical Support");
  const [priority, setPriority] = useState("Medium");
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState("");

  async function handlePhotoChange(event) {
    const selectedFiles = Array.from(event.target.files || []);
    event.target.value = "";

    if (photos.length + selectedFiles.length > MAX_PHOTOS) {
      setError("You can attach a maximum of 2 photos.");
      return;
    }

    for (const file of selectedFiles) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        setError("Please upload JPG, PNG, or WebP images only.");
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError("Each photo must be 1 MB or smaller.");
        return;
      }
    }

    try {
      const savedImages = await Promise.all(selectedFiles.map(readImage));
      setPhotos((previous) => [...previous, ...savedImages]);
      setError("");
    } catch (readError) {
      setError(readError.message);
    }
  }

  function removePhoto(index) {
    setPhotos((previous) =>
      previous.filter((_, photoIndex) => photoIndex !== index)
    );
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!subject.trim() || !description.trim()) {
      setError("Subject and description are required.");
      return;
    }

    const newTicket = {
      id: `HD-${Date.now()}`,
      subject: subject.trim(),
      customer: "Demo Customer",
      email: "customer@example.com",
      category,
      priority,
      status: "Open",
      createdAt: new Date().toISOString().slice(0, 10),
      description: description.trim(),
      photos,
    };

    setTickets((previousTickets) => [newTicket, ...previousTickets]);
    navigate("/customer/tickets");
  }

  return (
    <div className="app-layout">
      <Sidebar role="CUSTOMER" />

      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>Create Ticket</h1>
            <p className="muted">
              Describe your issue and attach screenshots if needed.
            </p>
          </div>
          <div className="user-avatar">CU</div>
        </header>

        <section className="section-card">
          <form className="ticket-form" onSubmit={handleSubmit}>
            <label htmlFor="subject">Subject</label>
            <input
              id="subject"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="Briefly describe your issue"
              maxLength={100}
              required
            />
            <div className="character-count">{subject.length}/100 characters</div>

            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value.slice(0, MAX_DESCRIPTION))
              }
              placeholder="Explain what happened and what you expected."
              rows={5}
              maxLength={MAX_DESCRIPTION}
              required
            />
            <div className="character-count">
              {description.length}/{MAX_DESCRIPTION} characters
            </div>

            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option>Technical Support</option>
              <option>Billing</option>
              <option>Account Access</option>
              <option>General Inquiry</option>
            </select>

            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Urgent</option>
            </select>

            <label htmlFor="photos">Attach photos (optional)</label>
            <p className="muted">Up to 2 JPG, PNG, or WebP images, 1 MB each.</p>
            <input
              id="photos"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handlePhotoChange}
              disabled={photos.length >= MAX_PHOTOS}
            />

            {photos.length > 0 && (
              <div className="photo-preview-grid">
                {photos.map((photo, index) => (
                  <div className="photo-preview" key={`${photo.name}-${index}`}>
                    <img src={photo.url} alt={photo.name} />
                    <div className="photo-preview-footer">
                      <span>{photo.name}</span>
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {error && <p className="form-error">{error}</p>}

            <div className="ticket-form-actions">
              <button className="customer-create-button" type="submit">
                Submit Ticket
              </button>
              <Link to="/customer">Cancel</Link>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

export default CreateTicket;