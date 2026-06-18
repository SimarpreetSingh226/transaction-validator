import { useState } from "react";
import { useConfig } from "../../context/ConfigContext.jsx";
import { Card, CardHeader, CardBody } from "../ui/Card.jsx";
import { Button } from "../ui/Button.jsx";

export function CountryRulesPanel() {
  const { countryRules, updateCountryRule, addCountryRule, removeCountryRule } =
    useConfig();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRule, setNewRule] = useState({
    code: "",
    name: "",
    dialCode: "",
    digits: "",
  });

  const handleAdd = () => {
    if (!newRule.code || !newRule.dialCode || !newRule.digits) return;
    addCountryRule({
      code: newRule.code.toUpperCase(),
      name: newRule.name || newRule.code.toUpperCase(),
      dialCode: newRule.dialCode.replace("+", ""),
      digits: Number(newRule.digits),
    });
    setNewRule({ code: "", name: "", dialCode: "", digits: "" });
    setShowAddForm(false);
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="font-display font-medium text-sm text-base-100">
          Country phone rules
        </h3>
        <Button
          variant="ghost"
          className="!px-2 !py-1 text-xs"
          onClick={() => setShowAddForm((s) => !s)}
        >
          {showAddForm ? "cancel" : "+ add country"}
        </Button>
      </CardHeader>
      <CardBody>
        {showAddForm && (
          <div className="mb-4 p-3 bg-base-700/40 rounded-md grid grid-cols-2 sm:grid-cols-4 gap-2">
            <input
              placeholder="Code (e.g. SG)"
              value={newRule.code}
              onChange={(e) =>
                setNewRule((r) => ({ ...r, code: e.target.value }))
              }
              className="bg-base-900 border border-base-500 rounded px-2 py-1.5 text-xs font-mono text-base-100 placeholder:text-base-500"
            />
            <input
              placeholder="Name"
              value={newRule.name}
              onChange={(e) =>
                setNewRule((r) => ({ ...r, name: e.target.value }))
              }
              className="bg-base-900 border border-base-500 rounded px-2 py-1.5 text-xs font-mono text-base-100 placeholder:text-base-500"
            />
            <input
              placeholder="Dial code (e.g. 65)"
              value={newRule.dialCode}
              onChange={(e) =>
                setNewRule((r) => ({ ...r, dialCode: e.target.value }))
              }
              className="bg-base-900 border border-base-500 rounded px-2 py-1.5 text-xs font-mono text-base-100 placeholder:text-base-500"
            />
            <div className="flex gap-2">
              <input
                placeholder="Digits"
                value={newRule.digits}
                onChange={(e) =>
                  setNewRule((r) => ({ ...r, digits: e.target.value }))
                }
                className="bg-base-900 border border-base-500 rounded px-2 py-1.5 text-xs font-mono text-base-100 placeholder:text-base-500 w-full"
              />
              <Button
                variant="primary"
                className="!px-3 !py-1 text-xs"
                onClick={handleAdd}
              >
                add
              </Button>
            </div>
          </div>
        )}

        <div className="max-h-72 overflow-y-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-base-600 text-base-400">
                <th className="text-left py-2 pr-2 font-medium">Code</th>
                <th className="text-left py-2 pr-2 font-medium">Country</th>
                <th className="text-left py-2 pr-2 font-medium">Dial</th>
                <th className="text-left py-2 pr-2 font-medium">Digits</th>
                <th className="text-right py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {countryRules.map((rule) => (
                <tr
                  key={rule.code}
                  className="border-b border-base-700/60 last:border-0"
                >
                  <td className="py-2 pr-2 text-signal-amber">{rule.code}</td>
                  <td className="py-2 pr-2 text-base-200">{rule.name}</td>
                  <td className="py-2 pr-2 text-base-300">+{rule.dialCode}</td>
                  <td className="py-2 pr-2 text-base-300">
                    <input
                      type="number"
                      value={rule.digits ?? ""}
                      placeholder={
                        rule.digitsRange
                          ? `${rule.digitsRange[0]}-${rule.digitsRange[1]}`
                          : ""
                      }
                      onChange={(e) =>
                        updateCountryRule(rule.code, {
                          digits: Number(e.target.value) || undefined,
                        })
                      }
                      className="bg-base-900 border border-base-600 rounded px-1.5 py-0.5 w-16 text-base-100"
                    />
                  </td>
                  <td className="py-2 text-right">
                    <button
                      onClick={() => removeCountryRule(rule.code)}
                      className="text-base-500 hover:text-signal-red transition-colors"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  );
}
