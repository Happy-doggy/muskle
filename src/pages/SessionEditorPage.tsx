import { useParams } from 'react-router-dom'
import SessionForm from '../components/SessionForm'

export default function SessionEditorPage() {
  const { id } = useParams<{ id: string }>()
  return <SessionForm sessionId={id} />
}
