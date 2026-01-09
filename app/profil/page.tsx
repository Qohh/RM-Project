import Image from "next/image";

export default function ProfilePage() {
  return (
    <div className="pt-10 pb-10 px-4 md:px-6 max-w-7xl mx-auto flex gap-8">
      <div>
      {/* Konten utama */}
      <main className="flex-1 flex flex-col gap-5">
        {/* Sejarah */}
        <section id="sejarah" className="bg-white rounded-lg shadow p-10">
          <h2 className="text-2xl font-heading font-bold mb-4 text-primary">Sejarah</h2>
          <p className="text-justify mb-4 indent-5 font-sans">
            Pada tanggal 23 Oktober 1978 diresmikan sebuah bangunan masjid yang berlokasi di Jl. Jendral Ahmad Yani Kota Pontianak diberi nama Masjid MUJAHIDIN yang berarti Para Pejuang di karenakan proses pendirian masjid Raya ini memerlukan perjuangan yang besar, semua elemen umat Islam saling-bahu membahu untuk mendirikan sebuah masjid  Raya Mujahidin.
          </p>
          <p className="text-justify mb-4 indent-5 font-sans">
            Masjid Raya Mujahidin tidak hanya diisi dan diramaikan oleh jamaah yang dewasa (sudah berkeluarga) akan tetapi mendorong generasi muda untuk turut berupaya mengisi kegiatan Masjid dalam arti positif sebagai proses kaderisasi dan pedelegasian tanggung jawab . Maka tidak beberapa lama sejak diresmikan Masjid Raya Mujahidin para pemuda/remaja disekitar membentuk suatu organisasi untuk mengajak peran serta remaja untuk berdakwah dan mengisi kegiatan bermanfaat yang diberi nama Remaja Mujahidin, yang berdiri di Pontianak pada tanggal  2 April 1979 bertepatan dengan 4 Jumadil Awal 1399 H.
          </p>
          <p className="text-justify mb-4 indent-5 font-sans">
            REMAJA MUJAHIDIN (RM) merupakan bagian dari Masjid Raya Mujahdin, mencoba melaksanakan segala kegiatannya dari tahun ke tahun dengan mengikuti perkembangan sosial remaja, khususnya remaja ibukota Provinsi. Agar tetap terarah maka RM terus berupaya melakukan perbaikan dalam agenda-agendanya. 
          </p>
        </section>

        {/* Visi-Misi */}
        <section id="visi-misi" className="bg-white rounded-lg shadow p-10">
          <h2 className="text-2xl font-heading font-bold mb-4 text-primary">Visi & Misi</h2>
          <h3 className="text-xl font-heading font-bold mb-4 text-black">Visi</h3>
           <p className="text-justify mb-4 indent-5 font-sans">
            Mewujudkan Remaja Mujahidin sebagai wadah pembentukan karakter generasi muda yang beriman dan bertakwa kepada Allah Swt, membentuk potensi kader sesuai bidangnya masing-masing, dan menjadi lembaga dakwah yang mandiri, serta memiliki citra positif di Kota Pontianak.
           </p>
          <h3 className="text-xl font-heading font-bold mb-4 text-black">Misi</h3>
          <ol className="list-[lower-alpha] list-outside ml-6 space-y-2 text-justify leading-relaxed font-sans">
            <li className="pl-2">
              Melakukan perekrutan, pembinaan dan pemberdayaan anggota Remaja Mujahidin agar terwujudnya Remaja Mujahidin yang produktif. </li>
            <li className="pl-2">
              Mengadakan pelatihan minat dan bakat sesuai dengan hasil survey yang sudah dilakukan untuk mengembangkan potensi-potensi kader Remaja Mujahidin. </li>
            <li className="pl-2">
              Menjadi organisasi yang mandiri dalam hal finansial yang berasal dari sumber-sumber dana yang halal untuk organisasi. </li>
            <li className="pl-2">
              Mensyiarkan dakwah keislaman berbasis kemasjidan dan kekinian sesuai dengan perkembangan zaman. </li>
            <li className="pl-2">
              Menjalin silaturahmi sesama Remaja Masjid lokal maupun nasional, dan organisasi masyarakat di Kota Pontianak. </li>
            <li className="pl-2">
              Menjadikan kesekretariatan dan Masjid sebagai pusat dakwah dalam syiar keislaman dan pengembangan potensi kader Remaja Mujahidin.  </li>
            <li className="pl-2">
              Menjadikan media sosial Remaja Mujahidin sebagai media yang informatif dan terpercaya.  </li>
            <li className="pl-2">
              Memberikan pelayanan secara maksimal kepada Jamaah Masjid Raya Mujahidin Kalimantan Barat. </li>
          </ol>
        </section>

        {/* Struktur Kepengurusan */}
        <section id="struktur" className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-heading font-bold mb-4 text-primary">Struktur Kepengurusan</h2>
          <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm font-sans">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-center" colSpan={2}>KEWIRAUSAHAAN</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2">Ketua</td>
                <td className="border px-4 py-2">Farah Zhafirah</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Anggota</td>
                <td className="border px-4 py-2">Dini Lestari</td>
              </tr>
              <tr>
                <td className="border px-4 py-2"></td>
                <td className="border px-4 py-2">Dinda Ramadanti</td>
              </tr>
              <tr>
                <td className="border px-4 py-2"></td>
                <td className="border px-4 py-2">Fathia Alya Supandih</td>
              </tr>
              <tr>
                <td className="border px-4 py-2"></td>
                <td className="border px-4 py-2">Anaqah Aisyah Hadiasmah</td>
              </tr>
              <tr>
                <td className="border px-4 py-2"></td>
                <td className="border px-4 py-2">Muhammad Al Fandi</td>
              </tr>
              <tr>
                <td className="border px-4 py-2"></td>
                <td className="border px-4 py-2">Indra Maulana</td>
              </tr>
              <tr>
                <td className="border px-4 py-2"></td>
                <td className="border px-4 py-2">Khoirul Rasyidin</td>
              </tr>
            </tbody>
          </table>
        </div>
        </section>

      </main>
    </div>
    </div>
  );
}
