import React, { SyntheticEvent, useEffect, useState, Component } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { IPost } from "../interfaces/post"
import { IUser } from "../interfaces/user"
import axios from "axios"

function PostCardFull({ title, content, code, image, user, id, category }: IPost) {
  const [post, updateposts] = React.useState<IPost | null>(null)
  const [currentUser, updateCurrentUser] = useState<IUser | null>(null);
  const { postId } = useParams()
  const navigate = useNavigate()


  React.useEffect(() => {
    async function fetchposts() {
      const resp = await fetch(`/api/posts/${id}`)
      const postsData = await resp.json()
      updateposts(postsData)
    }
    fetchposts()
  }, [])

  async function fetchUser() {
    const token = localStorage.getItem('token')
    const resp = await axios.get(`/api/user`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    updateCurrentUser(resp.data)
  }

  React.useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) fetchUser()
  }, [])

  async function deletePost(e: SyntheticEvent) {
    try {
      const token = localStorage.getItem('token')
      const resp = await axios.delete(`api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      navigate('/posts')
    } catch (error) {
    }
  }

  const [formData, setFormData] = useState({
    content: ""
  })
  const [errorData, setErrorData] = useState("")

  function handleChange(e: any) {
    const fieldName = e.target.name
    const newFormData = structuredClone(formData)
    newFormData[fieldName as keyof typeof formData] = e.target.value
    setFormData(newFormData)
    setErrorData("")
  }

  async function commentPost(e: SyntheticEvent) {
    try {
      const token = localStorage.getItem('token')
      const resp = await axios.post(`/api/posts/${id}/comments`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const newFormData = structuredClone(formData)
      if (resp.data.message) {
        throw new Error(resp.data.message);
      }
      location.reload()
    } catch (e: any) {
      setErrorData(e.message)
    }
  }


  return <> <section className="section">
    <Link to={`/posts/${id}`}>
    <div className="card">
      <footer className="card-footer">
        {post && currentUser && (currentUser.id === post.user.id) && <button onClick={deletePost} className="card-footer-item">Delete</button>}
        {post && currentUser && (currentUser.id === post.user.id) && <a className="card-footer-item" href={`/update/${id}`}><button>Update</button></a>}
      </footer>
      {post?.image && <div className="card-image">
        <figure className="image is-square">
          <img
            src={image}
            alt="Placeholder image"
          />
        </figure>
      </div>}
      <div className="card-content">
        <div className="media m-6">
          <div className="media-left">
            <figure className="image is-128x128 mb-4">
              <img
                src={user.image}
                alt="Placeholder image"
              />
            </figure>
          </div>
          <div className="media-content">
            <p className="title is-4">{user.username}</p>
            <p className="subtitle is-6">{`${user.firstname}`}</p>
            <p className="subtitle is-6">{`${user.lastname}`}</p>
            <p className="subtitle is-6">{`Feeling ${category}`}</p>
            </div>
            <p>{title}</p>
            <br />
            {post?.content && <p>{content}</p>}
            <br />
            {post?.code && <pre> 
              <code className="language-html line-numbers" data-prismjscopy="copy the html snippet!">{code}</code>
            </pre>}

        </div>
          {currentUser && <>
          <footer className="card-footer">
              <textarea 
                className="textarea"
                name={'content'}
                onChange={handleChange}
                value={formData.content} 
                placeholder="write your comment here"></textarea>
          </footer>
            <div className="button has-text-centered mt-4">
          <button onClick={commentPost} className="card-footer-item is-centered ">Comment</button>
            </div></>}

      </div>

    </div>
    </Link>
  </section>
  </>
}
export default PostCardFull