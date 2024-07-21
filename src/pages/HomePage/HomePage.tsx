import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import CardHomepage from '../../components/CardHomepage';
import "./HomePage.scss";

interface Post {
    id: number;
    title: string;
    description: string;
    image: string | null;
}

const HomePage: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [currentPost, setCurrentPost] = useState<Post | null>(null);
    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<string | null>(null);

    useEffect(() => {
        const storedPosts = localStorage.getItem('posts');
        if (storedPosts) {
            setPosts(JSON.parse(storedPosts));
        }
    }, []);

    const deletePost = (id: number) => {
        const updatedPosts = posts.filter(post => post.id !== id);
        setPosts(updatedPosts);
        localStorage.setItem('posts', JSON.stringify(updatedPosts));
    };

    const editPost = (post: Post) => {
        setIsEditing(true);
        setCurrentPost(post);
        setTitle(post.title);
        setDescription(post.description);
        setImage(post.image);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentPost) {
            const updatedPosts = posts.map(post =>
                post.id === currentPost.id
                    ? { ...post, title, description, image }
                    : post
            );
            setPosts(updatedPosts);
            localStorage.setItem('posts', JSON.stringify(updatedPosts));
            setIsEditing(false);
            setCurrentPost(null);
            setTitle('');
            setDescription('');
            setImage(null);
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

    return (
        <div className="home-page">
            <h1>Home Page</h1>
            {isEditing && currentPost ? (
                //
                <Form onSubmit={handleEditSubmit}>
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
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Save
                    </Button>
                    <Button variant="secondary" type="button" onClick={()=>setIsEditing(false)}>
                        Cancel
                    </Button>
                </Form>
              
            ) : (
                <ul className="posts-list">
                    {posts.map(post => (
                        <CardHomepage
                            key={ post.id }
                            imageSrc={ post.image }
                            title={ post.title }
                            text={ post.description }
                            editPost={ ()=>editPost(post) }
                            deletePost={ ()=>deletePost(post.id) }
                        />
                    ))}
                </ul>
            )}
        </div>
    );
};

export default HomePage;
