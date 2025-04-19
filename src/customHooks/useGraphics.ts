import { useEffect, useState } from "react";
import useFetcho from "./useFetcho";
import { API_URL } from "../data/constants";
import dataGraphics from "../data/graphics.json";

const useGraphics = () => {
  const fetchWithLoading = useFetcho();

  const [valuesGraphics, setValuesGraphics] = useState({
    firstGraphics: dataGraphics.firstHomeGraphic,
    secondGraphics: dataGraphics.secondHomeGraphic,
  });

  const fetchReports = async (method: string) => {
    const response = await fetchWithLoading({
      url: `${API_URL}/toProcess`,
      method: "POST",
      body: {
        object: "REPORTS",
        method,
        params: [],
      },
    });
    return response;
  };

  const updateGraphics = async () => {
    try {
      const [emailPerDay, smsPerDay, emailSuccess, smsSuccess] = await Promise.all([
        fetchReports("get_emails_sent_by_day"),
        fetchReports("get_sms_sent_by_day"),
        fetchReports("get_email_success_and_failed"),
        fetchReports("get_sms_success_and_failed"),
      ]);

      const updatedGraphics = {
        firstGraphics: [
          { ...valuesGraphics.firstGraphics[0], configElements: { ...valuesGraphics.firstGraphics[0].configElements, data: emailPerDay } },
          { ...valuesGraphics.firstGraphics[1], configElements: { ...valuesGraphics.firstGraphics[1].configElements, data: smsPerDay } },
        ],
        secondGraphics: [
          { ...valuesGraphics.secondGraphics[0], configElements: { ...valuesGraphics.secondGraphics[0].configElements, data: emailSuccess } },
          { ...valuesGraphics.secondGraphics[1], configElements: { ...valuesGraphics.secondGraphics[1].configElements, data: smsSuccess } },
        ],
      };

      setValuesGraphics(updatedGraphics as any);
    } catch (error) {
      console.error("Error updating graphics:", error);
    }
  };

  useEffect(() => {
    updateGraphics();
  }, []);

  return { valuesGraphics, updateGraphics };
};

export default useGraphics;