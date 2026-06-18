import { useValidationContext } from "../../context/ValidationContext.jsx";
import { Card, CardHeader, CardBody } from "../ui/Card.jsx";
import { Badge } from "../ui/Badge.jsx";

export function FilePreviewTable({ limit = 6 }) {
  const { parsed } = useValidationContext();
  if (!parsed || parsed.rows.length === 0) return null;

  const previewRows = parsed.rows.slice(0, limit);
  const columns = parsed.headers;

  return (
    <Card>
      <CardHeader>
        <h3 className="font-display font-medium text-sm text-base-100">
          Preview
        </h3>
        <Badge variant="neutral">
          {parsed.rows.length.toLocaleString()} rows detected
        </Badge>
      </CardHeader>
      <CardBody className="overflow-x-auto p-0">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="border-b border-base-600">
              {columns.map((col) => (
                <th
                  key={col}
                  className="text-left px-4 py-2.5 text-base-400 font-medium whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {previewRows.map((row, idx) => (
              <tr key={idx} className="border-b border-base-700 last:border-0">
                {columns.map((col) => (
                  <td
                    key={col}
                    className="px-4 py-2.5 text-base-200 whitespace-nowrap max-w-[200px] truncate"
                  >
                    {row[col] || <span className="text-base-500">—</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
}
