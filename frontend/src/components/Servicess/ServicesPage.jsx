import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTooth } from "@fortawesome/free-solid-svg-icons";

const ServicesPage = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5098/api/Category")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }
        return response.json();
      })
      .then((data) => {
        const transformedServices = data.map((category) => ({
          category: category.category_name,
          procedures: category.services.map((service) => ({
            id: service.service_id,
            title: service.name,
            description: service.description,
            duration: service.duration,
            price: service.price,
          })),
        }));
        setServices(transformedServices);
      })
      .catch((error) => console.error("Error fetching services:", error));
  }, []);

  return (
    <section className="w-full py-10 px-10">
      <div className="max-w-7xl mb-14 text-center mx-auto">
        <h2 className="text-3xl font-bold">
          Our <span className="text-primary">Services</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-16">
        {services.map((service) => (
          <div key={service.category} className="space-y-12">
            <h3 className="text-2xl font-bold text-secondary/80 mb-6 text-center pb-4 border-b-2 border-b-gray/30">
              {service.category}
            </h3>

            <div className="space-y-6">
              {service.procedures.map((procedure) => (
                <div
                  key={procedure.id}
                  className="flex flex-col space-y-2 text-gray-800 hover:bg-gray-100 p-4 rounded-lg transition duration-300"
                >
                  <div className="flex items-center justify-center space-x-4">
                    <FontAwesomeIcon
                      icon={faTooth}
                      className="text-primary/20 w-10 h-10"
                    />

                    <div>
                      <h4 className="text-xl font-semibold text-secondary text-center">
                        {procedure.title}
                      </h4>
                      <p className="text-gray-600 text-sm ">
                        {procedure.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2 text-center ml-10">
                    <p className="text-gray-500 text-sm">
                      <span className="font-semibold text-primary">
                        Duration:
                      </span>{" "}
                      {procedure.duration} minutes
                    </p>
                    <p className="text-gray-500 text-sm">
                      <span className="font-semibold text-primary">Price:</span>{" "}
                      {procedure.price} $
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesPage;
