import { Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle, show, Button } from "react-bootstrap";
import React, { useState } from "react";

const API_IMG = "https://image.tmdb.org/t/p/w500/"

const MovieBox = ({title, poster_path, vote_average, release_date, overview}) => {

    const [show, setShow]=useState(false);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    return (
        <div className="card-movie card text-center mb-3">
            <div className="card-body">
                <img className="card-img-top" src={API_IMG+poster_path} alt="" />
                <br />

                    <h3 className="title-movie">{title}</h3>

                <div>
                    <p>Rating: {vote_average}</p>   
                    <button type="button" className="btn btn-dark" onClick={handleShow}>View Details</button>
                </div>
            </div>
            <Modal className="modal-movie" show={show} onHide={handleClose}>
                <ModalHeader closeButton>
                </ModalHeader>
                <div className="modal-wrapper">
                    <ModalBody>
                        <h1>{title}</h1>
                        <h4>IMDB: {vote_average}</h4>
                        <h5>Release Date: {release_date}</h5>

                        <br /><br />
                        <h4 style={{textAlign:'center'}}>Overview: {overview}</h4>

                    </ModalBody>
                    <ModalTitle>
                        <img className="card-img-top" src={API_IMG+poster_path} alt="" />
                    </ModalTitle>
                </div>
                <ModalFooter>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                </ModalFooter>
            </Modal>
        </div>
    )
}

export default MovieBox;