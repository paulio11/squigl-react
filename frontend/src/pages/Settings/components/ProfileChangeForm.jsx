import React, { useRef, useState } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import styles from "./ProfileChangeForm.module.css";
import { useAuth } from "../../../contexts/AuthContext";
import { backendAPI } from "../../../api/axiosConfig";
import Avatar from "../../../components/Avatar/Avatar";
import Title from "../../../components/Misc/Title";

const ProfileChangeForm = () => {
  const avatarInput = useRef();
  const backgroundInput = useRef();
  const { user, setUser } = useAuth();
  const { username, avatar, display_name, bio, link, background } = user;

  const [newProfileData, setNewProfileData] = useState({
    background: null,
    display_name,
    bio,
    link,
    avatar: null,
  });

  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    if (file) {
      URL.revokeObjectURL(newProfileData[key]);
      setNewProfileData((prev) => ({
        ...prev,
        [key]: URL.createObjectURL(file),
      }));
    }
  };

  const handleInputChange = ({ target: { name, value } }) => {
    setNewProfileData((prev) => ({
      ...prev,
      [name]:
        name === "link" && value && !value.startsWith("http")
          ? `https://${value}`
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    ["avatar", "background"].forEach((key) => {
      if (key === "avatar" && avatarInput.current?.files[0]) {
        formData.append(key, avatarInput.current.files[0]);
      }
      if (key === "background" && backgroundInput.current?.files[0]) {
        formData.append(key, backgroundInput.current.files[0]);
      }
    });

    Object.entries(newProfileData).forEach(([key, value]) => {
      if (key !== "avatar" && key !== "background" && value)
        formData.append(key, value);
    });

    try {
      setUploading(true);
      const { status, data } = await backendAPI.patch(
        `/profiles/${username}`,
        formData
      );
      if (status === 200) {
        setUser({ ...user, ...data });
        setNewProfileData((prev) => ({
          ...prev,
          avatar: null,
          background: null,
        }));
        avatarInput.current.value = "";
        backgroundInput.current.value = "";
      }
    } catch (error) {
      setErrors(error.response?.data);
    } finally {
      setUploading(false);
    }
  };

  const isDisabled = () => {
    const isFileChanged =
      avatarInput.current?.files[0] || backgroundInput.current?.files[0];
    const isProfileDataChanged =
      newProfileData.display_name !== display_name ||
      newProfileData.bio !== bio ||
      newProfileData.link !== link;
    return !isFileChanged && !isProfileDataChanged;
  };

  return (
    <>
      <Title title="Update your profile" />
      <Form onSubmit={handleSubmit} className="mb-5">
        <Form.Group className="mb-3">
          <Form.Label>
            <strong>Display name:</strong>
          </Form.Label>
          <Form.Control
            type="text"
            name="display_name"
            value={newProfileData.display_name}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>
            <strong>Avatar:</strong>
          </Form.Label>
          <Form.Control
            type="file"
            ref={avatarInput}
            onChange={(e) => handleFileChange(e, "avatar")}
            className={styles.hiddenInput}
          />
          <Avatar
            image={newProfileData.avatar || avatar}
            size="settings"
            username={username}
          />
          <Button
            className="themedButton mb-3"
            onClick={() => avatarInput.current.click()}
          >
            Select a new avatar
          </Button>
        </Form.Group>

        <Form.Group>
          <Form.Label>
            <strong>Background:</strong>
          </Form.Label>
          <Form.Control
            type="file"
            ref={backgroundInput}
            onChange={(e) => handleFileChange(e, "background")}
            className={styles.hiddenInput}
          />
          {background && (
            <img
              src={newProfileData.background || background}
              className={styles.background}
            />
          )}
          <Button
            style={{ display: "block" }}
            className="themedButton mb-3"
            onClick={() => backgroundInput.current.click()}
          >
            Select a new background
          </Button>
        </Form.Group>

        <Form.Group>
          <Form.Label>
            <strong>Bio:</strong>
          </Form.Label>
          <Form.Control
            as="textarea"
            name="bio"
            rows={5}
            value={newProfileData.bio}
            onChange={handleInputChange}
            maxLength={400}
          />
          <p className={styles.bioCount}>{newProfileData.bio.length}/400</p>
        </Form.Group>

        <Form.Group>
          <Form.Label>
            <strong>Website:</strong>
          </Form.Label>
          <Form.Control
            type="text"
            name="link"
            value={newProfileData.link}
            onChange={handleInputChange}
            placeholder="Add a link to your website."
          />
        </Form.Group>
        <div className={styles.saveButton}>
          <Button
            type="submit"
            className="themedButton mt-3 mb-3"
            disabled={uploading || isDisabled()}
          >
            {uploading ? "Uploading..." : "Save all profile changes"}
          </Button>
        </div>
        {Object.entries(errors).map(([key, messages]) =>
          messages.map((message, i) => (
            <Alert key={`${key}-${i}`} variant="warning">
              {message}
            </Alert>
          ))
        )}
      </Form>
    </>
  );
};

export default ProfileChangeForm;
