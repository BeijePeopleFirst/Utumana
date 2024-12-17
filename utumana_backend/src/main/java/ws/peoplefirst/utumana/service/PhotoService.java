package ws.peoplefirst.utumana.service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import ws.peoplefirst.utumana.dto.UserDTO;
import ws.peoplefirst.utumana.exception.InvalidJSONException;
import ws.peoplefirst.utumana.exception.TheJBeansException;
import ws.peoplefirst.utumana.model.Accommodation;
import ws.peoplefirst.utumana.model.Photo;
import ws.peoplefirst.utumana.repository.PhotoRepository;
import ws.peoplefirst.utumana.utility.AuthorizationUtility;

@Service
public class PhotoService {
	
	@Value("${photoPrefixPath.path}")
	private String destinationPathPhotoPrefix;
	
	@Autowired
	private PhotoRepository photoRepository;

	//0 usage
	public List<Photo> findByAccommodation(Accommodation base) {
		return photoRepository.findByAccommodation(base);
	}

	public Map<String, String> storePhotoOnServer(MultipartFile img, UserDTO loggedUser) {

		String orFilename = img.getOriginalFilename();
		byte[] content = null;
		FileOutputStream out = null;
		String finalUrl = null;
		try {

			finalUrl = URLEncoder.encode(loggedUser.getId() + "_" + new Date().getTime() + "." + orFilename.substring(orFilename.lastIndexOf('.') + 1), StandardCharsets.UTF_8.toString());

		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			throw new TheJBeansException("" + e);
		}
		//File destination = new File("/Users/riccardogugolati/LAVORO/People First/CouchSurfing/TheJBeansCouchSurfing/src/main/resources/static/images/" + finalUrl);
		File destination = new File(destinationPathPhotoPrefix + finalUrl);
		try {

			System.out.println("SONO DENTRO AL TRY");
			destination.createNewFile();
			out = new FileOutputStream(destination);
			content = img.getBytes();

			out.write(content);


		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		finally {

			try {
				out.close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

		}

		Map<String, String> map = new HashMap<String, String>();
		String res = null;
		res = "/userImages/" + finalUrl;
		map.put("url", res);

		return map;
	}

	//0 usage
	@Transactional
	public void save(Photo p) {
		photoRepository.save(p);
		
	}

}
