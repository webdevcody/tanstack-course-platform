import { FileText } from "lucide-react";

interface AssignmentViewerProps {
  assignments: string[];
}

export function AssignmentViewer({ assignments }: AssignmentViewerProps) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Assignments</h2>
      {assignments.length === 0 ? (
        <p className="text-gray-500 italic">No assignments available yet.</p>
      ) : (
        <ul className="space-y-2">
          {assignments.map((assignment, index) => (
            <li key={index}>
              <a
                href={assignment}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-600 hover:underline"
              >
                <FileText className="mr-2" size={20} />
                Assignment {index + 1}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
