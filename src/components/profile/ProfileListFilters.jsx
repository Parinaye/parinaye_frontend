import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../shadcn/components/ui/accordion";
import { Checkbox } from "../shadcn/components/ui/checkbox";
import {
  ASSETS_ENUM,
  CASTE_ENUM,
  EDUCATION_ENUM,
  MARITAL_STATUS_ENUM,
  PROFESSION_ENUM,
  RELIGION_ENUM,
} from "../../../config/enums.config";
import { Button } from "../shadcn/components/ui/button";
import moment from "moment";

export default function ProfileListFilters({
  filters,
  setFilters,
  handleFilterApply,
}) {
  const handleChange = (e) => {
    switch (e.target.id) {
      case "assets":
      case "profession":
      case "education":
      case "maritalStatus":
      case "income":
      case "religion":
      case "caste":
        let values = filters[e.target.id] || [];
        if (!values.includes(e.target.value)) {
          values.push(e.target.value);
        } else {
          values = values.filter((value) => value != e.target.value);
        }
        setFilters({ ...filters, [`${e.target.id}`]: values });
        return;
      case "feet":
        setFilters({
          ...filters,
          height: { inches: filters.height.inches, feet: e.target.value },
        });
        return;
      case "inches":
        setFilters({
          ...filters,
          height: { feet: filters.height.feet, inches: e.target.value },
        });
        return;
      case "female":
      case "male":
        setFilters({ ...filters, gender: e.target.id });
        return;
      default:
        setFilters({ ...filters, [e.target.id]: e.target.value });
    }
  };

  console.log(filters);
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="filters">
        <AccordionTrigger>Filters</AccordionTrigger>
        <AccordionContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="profession">
              <AccordionTrigger>Profession</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-row flex-wrap justify-start m-2">
                  {PROFESSION_ENUM.map((profession) => {
                    return (
                      <div className="flex items-center mx-4 ">
                        <Checkbox
                          id={"profession"}
                          value={profession}
                          onClick={handleChange}
                          checked={
                            filters.profession &&
                            filters.profession.includes(profession)
                          }
                        />
                        <label
                          htmlFor={profession}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed p-2 peer-disabled:opacity-70"
                        >
                          {profession}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="assets">
              <AccordionTrigger>Assets</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-row flex-wrap justify-start m-2">
                  {ASSETS_ENUM.map((asset) => {
                    return (
                      <div className="flex items-center mx-4 ">
                        <Checkbox
                          id={"assets"}
                          value={asset}
                          onClick={handleChange}
                          checked={
                            filters.assets && filters.assets.includes(asset)
                          }
                        />
                        <label
                          htmlFor={asset}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed p-2 peer-disabled:opacity-70"
                        >
                          {asset}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="education">
              <AccordionTrigger>Education</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-row flex-wrap justify-start m-2">
                  {EDUCATION_ENUM.map((education) => {
                    return (
                      <div className="flex items-center mx-4 ">
                        <Checkbox
                          id={"education"}
                          value={education}
                          onClick={handleChange}
                          checked={
                            filters.education &&
                            filters.education.includes(education)
                          }
                        />
                        <label
                          htmlFor={education}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed p-2 peer-disabled:opacity-70"
                        >
                          {education}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="marital_status">
              <AccordionTrigger>Marital Status</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-row flex-wrap justify-start m-2">
                  {MARITAL_STATUS_ENUM.map((maritalStatus) => {
                    return (
                      <div className="flex items-center mx-4 ">
                        <Checkbox
                          id={"maritalStatus"}
                          value={maritalStatus}
                          onClick={handleChange}
                          checked={
                            filters.maritalStatus &&
                            filters.maritalStatus.includes(maritalStatus)
                          }
                        />
                        <label
                          htmlFor={maritalStatus}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed p-2 peer-disabled:opacity-70"
                        >
                          {maritalStatus}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="religion">
              <AccordionTrigger>Religion</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-row flex-wrap justify-start m-2">
                  {RELIGION_ENUM.map((religion) => {
                    return (
                      <div className="flex items-center mx-4 ">
                        <Checkbox
                          id={"religion"}
                          value={religion}
                          onClick={handleChange}
                          checked={
                            filters.religion &&
                            filters.religion.includes(religion)
                          }
                        />
                        <label
                          htmlFor={religion}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed p-2 peer-disabled:opacity-70"
                        >
                          {religion}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="caste">
              <AccordionTrigger>Caste</AccordionTrigger>

              <AccordionContent>
                <Accordion type="single" className="w-full" collapsible>
                  <AccordionContent>
                    {Object.keys(CASTE_ENUM).map((caste) => {
                      return (
                        <div className="flex flex-col items-between mx-4">
                          <AccordionItem value={caste}>
                            <AccordionTrigger>{caste}</AccordionTrigger>
                            <AccordionContent>
                              <div className="flex flex-row flex-wrap justify-start m-2">
                                {CASTE_ENUM[caste].map((subCaste) => {
                                  return (
                                    <div className="flex flex-row items-center mx-1">
                                      <Checkbox
                                        id={`caste`}
                                        value={`${caste}:${subCaste}`}
                                        onClick={handleChange}
                                        checked={
                                          filters.caste &&
                                          filters.caste.includes(
                                            `${caste}:${subCaste}`
                                          )
                                        }
                                      />
                                      <label
                                        htmlFor={`${caste}:${subCaste}`}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed p-2 peer-disabled:opacity-70"
                                      >
                                        {`${subCaste}`}
                                      </label>
                                    </div>
                                  );
                                })}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </div>
                      );
                    })}
                  </AccordionContent>
                </Accordion>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="createdAt">
              <AccordionTrigger>Created At</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-row flex-wrap justify-between items-center m-2">
                  <label htmlFor="createdAtGte" className="text-sm font-medium">
                    From :
                  </label>
                  <input
                    type="date"
                    id="createdAtGte"
                    defaultValue={filters.createdAtGte}
                    onChange={handleChange}
                    className="p-2 m-2 bg-secondary"
                  />
                </div>
                <div className="flex flex-row flex-wrap justify-between items-center m-2">
                  <label htmlFor="createdAtLte" className="text-sm font-medium">
                    To :
                  </label>
                  <input
                    type="date"
                    id="createdAtLte"
                    value={filters.createdAtLte}
                    onChange={handleChange}
                    className="p-2 m-2 bg-secondary"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div className="flex flex-row flex-wrap justify-center gap-2 m-2">
            <Button className="flex-grow" onClick={handleFilterApply}>
              Apply
            </Button>
            <Button
              className="flex-grow"
              onClick={() => {
                setFilters({});
                handleFilterApply();
              }}
            >
              Clear
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
