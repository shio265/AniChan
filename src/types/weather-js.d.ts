declare module 'weather-js' {
  type WeatherFindOptions = {
    search: string;
    degreeType: 'C' | 'F';
  };

  type WeatherResult = {
    current: {
      observationpoint: string;
      skytext: string;
      imageUrl: string;
      temperature: string;
      feelslike: string;
      winddisplay: string;
      humidity: string;
      observationtime: string;
    };
    location: {
      long: string;
      lat: string;
      degreetype: string;
      timezone: string;
    };
  };

  function find(
    options: WeatherFindOptions,
    callback: (error: Error | null, result: WeatherResult[] | undefined) => void,
  ): void;

  export default { find };
}
