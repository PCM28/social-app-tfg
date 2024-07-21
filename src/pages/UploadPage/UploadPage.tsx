import React, { useRef, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import "./UploadPage.scss";

const UploadPage: React.FC = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const storedPosts = localStorage.getItem('posts');
        const posts = storedPosts ? JSON.parse(storedPosts) : [];

        const newPost = {
            id: Date.now(),
            title,
            description,
            image
        };

        posts.unshift(newPost); 
        
        localStorage.setItem('posts', JSON.stringify(posts));

        setTitle('');
        setDescription('');
        setImage(null);
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCancel = () => {
        setTitle("");
        setDescription("");
        setImage(null);
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="upload-page">
            <h1>Share your Posts!</h1>
            
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Title</Form.Label>
                    <Form.Control 
                        type="text"
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Description</Form.Label>
                    <Form.Control 
                        as="textarea" 
                        rows={3}
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Control 
                        type="file" 
                        onChange={handleImageChange} 
                        accept="image/*"
                        ref={fileInputRef}
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Submit
                </Button>
                <Button variant="secondary" type="button" onClick={handleCancel}>
                    Cancel
                </Button>
            </Form>
        </div>
    );
};

export default UploadPage;
