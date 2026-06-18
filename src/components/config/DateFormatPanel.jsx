import { useConfig } from "../../context/ConfigContext.jsx";
import { Card, CardHeader, CardBody } from "../ui/Card.jsx";

export function DateFormatPanel() {
  const { dateFormats, toggleDateFormat } = useConfig();

  return (
    <Card>
      <CardHeader>
        <h3 className="font-display font-medium text-sm text-base-100">
          Accepted date / time formats
        </h3>
      </CardHeader>
      <CardBody>
        <div className="space-y-2">
          {dateFormats.map((fmt) => (
            <label
              key={fmt.id}
              className="flex items-center justify-between gap-3 px-3 py-2 rounded-md hover:bg-base-700/40 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={fmt.enabled}
                  onChange={() => toggleDateFormat(fmt.id)}
                  className="accent-signal-amber w-4 h-4"
                />
                <span className="text-sm font-mono text-base-100">
                  {fmt.label}
                </span>
              </div>
              <span className="text-xs font-mono text-base-500">
                {fmt.example}
              </span>
            </label>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
