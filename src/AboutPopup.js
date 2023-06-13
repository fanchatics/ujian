import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const AboutPopup = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose} fullscreen>
      <Modal.Header closeButton>
        <Modal.Title>About Us</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Add your about us content here...</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AboutPopup;