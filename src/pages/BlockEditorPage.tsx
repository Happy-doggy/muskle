import { useParams } from 'react-router-dom'
import BlockForm from '../components/BlockForm'

export default function BlockEditorPage() {
  const { id } = useParams<{ id: string }>()
  return <BlockForm blockId={id} />
}
