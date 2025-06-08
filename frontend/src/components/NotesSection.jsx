export default function NotesSection({ notes }) {
  if (!notes) return null;
  return <div className="notes-section">📝 <b>Notes:</b> {notes}</div>;
}
