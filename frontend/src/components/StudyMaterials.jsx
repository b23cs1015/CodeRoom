import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getMaterials, uploadMaterial } from '../features/materials/materialSlice';
import styles from './StudyMaterials.module.css';

// Base URL for linking to uploaded files
const SERVER_URL = 'http://localhost:5000/';

function StudyMaterials({ classroomId, userRole }) {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const { materials, isLoading } = useSelector((state) => state.materials);

  useEffect(() => {
    dispatch(getMaterials(classroomId));
  }, [dispatch, classroomId]);

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (file) {
      dispatch(uploadMaterial({ classroomId, file }));
      setFile(null); // Reset file input
      e.target.reset(); // Reset form
    }
  };

  return (
    <div className={styles.materialsSection}>
      <h2>Study Materials</h2>

      {userRole === 'Teacher' && (
        <form onSubmit={onSubmit} className={styles.uploadForm}>
          <input type="file" onChange={onFileChange} required />
          <button type="submit" disabled={!file || isLoading}>
            {isLoading ? 'Uploading...' : 'Upload File'}
          </button>
        </form>
      )}

      <div className={styles.materialList}>
        {materials.length > 0 ? (
          materials.map((material) => (
            <a
              key={material._id}
              href={`${SERVER_URL}${material.filePath}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.materialItem}
            >
              {material.originalName}
            </a>
          ))
        ) : (
          <p>No study materials have been uploaded yet.</p>
        )}
      </div>
    </div>
  );
}

export default StudyMaterials;